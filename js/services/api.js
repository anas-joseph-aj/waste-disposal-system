// API service layer for frontend
// Handles all backend communication with automatic token attachment

const DEFAULT_API_BASE = 'http://localhost:5000/api';
const API_BASE_KEY = 'wds_api_base';
const AUTH_TOKEN_KEY = 'wds_auth_token_v1';
const SESSION_KEY = 'wds_session_v1';

let resolvedApiBase = '';
let apiBaseProbePromise = null;
let apiBaseProbeAt = 0;
const API_BASE_PROBE_TTL_MS = 60000;

function getApiBaseFromMeta() {
  const node = document.querySelector('meta[name="wds-api-base"]');
  if (!node) {
    return '';
  }

  return String(node.getAttribute('content') || '').trim();
}

function getApiBase() {
  if (resolvedApiBase) {
    return resolvedApiBase;
  }

  const fromMeta = getApiBaseFromMeta();
  if (fromMeta) {
    return String(fromMeta).replace(/\/+$/, '');
  }

  if (window.__WDS_API_BASE__) {
    return String(window.__WDS_API_BASE__).replace(/\/+$/, '');
  }

  // Check window variable first (set via URL param)
  if (window.WDS_API_BASE) {
    return String(window.WDS_API_BASE).replace(/\/+$/, '');
  }

  // Check localStorage
  const stored = localStorage.getItem(API_BASE_KEY);
  if (stored) {
    return String(stored).replace(/\/+$/, '');
  }

  // Return default for development
  return DEFAULT_API_BASE;
}

export function setApiBase(url) {
  const normalized = String(url || '').replace(/\/+$/, '');
  if (!normalized) {
    return;
  }

  localStorage.setItem(API_BASE_KEY, normalized);
  window.WDS_API_BASE = normalized;
  resolvedApiBase = normalized;
}

function getApiBaseCandidates() {
  const sameOriginApi =
    window.location?.origin && /^https?:\/\//i.test(window.location.origin)
      ? `${window.location.origin.replace(/\/+$/, '')}/api`
      : '';

  const fallbackPorts = Array.from({ length: 6 }, (_, index) => 5000 + index);
  const fallbackCandidates = fallbackPorts.flatMap((port) => [
    `http://localhost:${port}/api`,
    `http://127.0.0.1:${port}/api`
  ]);

  const candidates = [
    getApiBaseFromMeta(),
    window.__WDS_API_BASE__,
    window.WDS_API_BASE,
    localStorage.getItem(API_BASE_KEY),
    sameOriginApi,
    DEFAULT_API_BASE,
    ...fallbackCandidates
  ];

  return [...new Set(candidates.map((value) => String(value || '').replace(/\/+$/, '')).filter(Boolean))];
}

async function isApiBaseReachable(base) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 800);

  try {
    const response = await fetch(`${base}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    if (!response.ok) {
      return false;
    }

    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('application/json')) {
      return false;
    }

    const data = await response.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return false;
    }

    const status = String(data.status || '').toLowerCase();
    return status === 'ok' || status === 'healthy' || status === 'up';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function resolveApiBase(forceRefresh = false) {
  if (resolvedApiBase && !forceRefresh) {
    return resolvedApiBase;
  }

  const stored = getApiBase();
  if (stored) {
    resolvedApiBase = stored;
    if (forceRefresh) {
      verifyApiBaseInBackground(stored);
    }
    return stored;
  }

  const firstCandidate = getApiBaseCandidates()[0] || DEFAULT_API_BASE;
  resolvedApiBase = firstCandidate;
  verifyApiBaseInBackground(firstCandidate);
  return firstCandidate;
}

function verifyApiBaseInBackground(base) {
  const now = Date.now();
  if (apiBaseProbePromise && now - apiBaseProbeAt < API_BASE_PROBE_TTL_MS) {
    return apiBaseProbePromise;
  }

  apiBaseProbeAt = now;
  apiBaseProbePromise = (async () => {
    const candidates = [base, ...getApiBaseCandidates().filter((candidate) => candidate !== base)].slice(0, 4);

    for (const candidate of candidates) {
      if (await isApiBaseReachable(candidate)) {
        setApiBase(candidate);
        return candidate;
      }
    }

    return '';
  })().finally(() => {
    apiBaseProbePromise = null;
  });

  return apiBaseProbePromise;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    requireAuth = true,
    returnRaw = false
  } = options;

  const base = resolveApiBase();
  const url = `${base}${path}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getAuthToken();
  if (requireAuth && !token) {
    const authError = new Error('No token provided. Please login again.');
    authError.status = 401;
    throw authError;
  }

  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const buildRequestError = (message, status, data) => {
    const reqError = new Error(message || 'Request failed');
    reqError.status = status;
    reqError.data = data;

    if (status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
    }

    return reqError;
  };

  const executeRequest = async (targetUrl) => {
    const response = await fetch(targetUrl, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const statusLabel = `${response.status}${response.statusText ? ` ${response.statusText}` : ''}`.trim();
      
      if (response.status === 405) {
        console.warn(`⚠️ 405 Method Not Allowed for ${method} ${targetUrl}`);
      }
      
      const inferredMessage = data.message
        || data.error
        || (response.status === 404 ? 'Requested API route was not found. Please verify the API base URL.' : '')
        || (response.status === 405 ? `Method ${method} not supported on this endpoint. Contact support if the issue persists.` : '')
        || `Request failed (${statusLabel})`;
      throw buildRequestError(inferredMessage, response.status, data);
    }

    return returnRaw ? response : data;
  };

  const retryAcrossCandidates = async (primaryBase, originalError) => {
    const candidateBases = getApiBaseCandidates().filter((candidate) => candidate && candidate !== primaryBase).slice(0, 4);
    let lastError = originalError;

    for (const candidateBase of candidateBases) {
      try {
        const result = await executeRequest(`${candidateBase}${path}`);
        setApiBase(candidateBase);
        return result;
      } catch (candidateError) {
        if (candidateError && typeof candidateError === 'object' && 'status' in candidateError) {
          lastError = candidateError;
          continue;
        }

        if (candidateError instanceof TypeError) {
          lastError = candidateError;
          continue;
        }

        throw candidateError;
      }
    }

    throw lastError;
  };

  try {
    const result = await executeRequest(url);
    verifyApiBaseInBackground(base);
    return result;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      if (Number(error.status) === 404) {
        const notFoundError = new Error('Requested API route was not found. Please verify the API base URL.');
        notFoundError.status = 404;
        notFoundError.data = error.data;
        throw notFoundError;
      }

      throw error;
    }

    if (error instanceof TypeError) {
      // Retry across discovered API bases to recover from stale/invalid base values.
      try {
        const retryBase = resolveApiBase(true);
        const candidateBases = [
          retryBase,
          ...getApiBaseCandidates()
        ].filter(Boolean);

        const uniqueBases = [...new Set(candidateBases)];
        let lastNetworkError = error;

        for (const candidateBase of uniqueBases) {
          try {
            return await executeRequest(`${candidateBase}${path}`);
          } catch (retryError) {
            if (retryError && typeof retryError === 'object' && 'status' in retryError) {
              throw retryError;
            }

            if (retryError instanceof TypeError) {
              lastNetworkError = retryError;
              continue;
            }

            throw retryError;
          }
        }

        const connectionError = new Error('Service is temporarily unavailable. Please try again in a few moments.');
        connectionError.cause = lastNetworkError;
        throw connectionError;
      } catch (retryError) {
        if (retryError && typeof retryError === 'object' && 'status' in retryError) {
          throw retryError;
        }

        if (!(retryError instanceof TypeError)) {
          throw retryError;
        }

        const connectionError = new Error('Service is temporarily unavailable. Please try again in a few moments.');
        connectionError.cause = error;
        throw connectionError;
      }
    }

    throw error;
  }
}

// AUTH ENDPOINTS
export const authAPI = {
  register: (name, email, phone, password, address = '') =>
    request('/auth/register', {
      method: 'POST',
      body: { name, email, phone, password, address },
      requireAuth: false
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
      requireAuth: false
    }),

  checkEmail: (email) =>
    request('/auth/check-email', {
      method: 'POST',
      body: { email },
      requireAuth: false
    }),

  resetPassword: (email, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: { email, newPassword },
      requireAuth: false
    }),

  getCurrentUser: () =>
    request('/auth/me', { requireAuth: true })
};

// USER ENDPOINTS
export const userAPI = {
  getAll: (role) =>
    request(`/users${role ? `?role=${role}` : ''}`, {
      method: 'GET',
      requireAuth: true
    }),

  getCollectors: () =>
    request('/users/collectors', {
      method: 'GET',
      requireAuth: true
    }),

  getById: (id) =>
    request(`/users/${id}`, { requireAuth: true }),

  updateProfile: (id, updates) =>
    request(`/users/${id}/profile`, {
      method: 'PUT',
      body: updates,
      requireAuth: true
    }),

  changePassword: (id, currentPassword, newPassword) =>
    request(`/users/${id}/password`, {
      method: 'PUT',
      body: { currentPassword, newPassword },
      requireAuth: true
    }),

  create: (userData) =>
    request('/users', {
      method: 'POST',
      body: userData,
      requireAuth: true
    }),

  delete: (id) =>
    request(`/users/${id}`, {
      method: 'DELETE',
      requireAuth: true
    })
};

// PICKUP ENDPOINTS
export const pickupAPI = {
  create: (pickupData) =>
    request('/pickups', {
      method: 'POST',
      body: pickupData,
      requireAuth: true
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/pickups?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  },

  getById: (id) =>
    request(`/pickups/${id}`, { requireAuth: true }),

  updateStatus: (id, status, collectorProofImage = '', options = {}) =>
    request(`/pickups/${id}/status`, {
      method: 'PUT',
      body: {
        status,
        collectorProofImage,
        clearCollectorAssignment: Boolean(options?.clearCollectorAssignment),
        rejectReason: String(options?.rejectReason || '').trim()
      },
      requireAuth: true
    }),

  assignCollector: (id, collectorId) =>
    request(`/pickups/${id}/assign`, {
      method: 'PUT',
      body: { collectorId },
      requireAuth: true
    }),

  delete: (id) =>
    request(`/pickups/${id}`, {
      method: 'DELETE',
      requireAuth: true
    })
};

// COMPLAINT ENDPOINTS
export const complaintAPI = {
  create: (complaintData) =>
    request('/complaints', {
      method: 'POST',
      body: complaintData,
      requireAuth: true
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/complaints?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  },

  updateStatus: (id, status, resolution) =>
    request(`/complaints/${id}/status`, {
      method: 'PUT',
      body: { status, resolution },
      requireAuth: true
    }),

  delete: (id) =>
    request(`/complaints/${id}`, {
      method: 'DELETE',
      requireAuth: true
    })
};

// PAYMENT ENDPOINTS
export const paymentAPI = {
  create: (paymentData) =>
    request('/payments', {
      method: 'POST',
      body: paymentData,
      requireAuth: true
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/payments?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  },

  getById: (id) =>
    request(`/payments/${id}`, { requireAuth: true })
};

// FEEDBACK ENDPOINTS
export const feedbackAPI = {
  create: (feedbackData) =>
    request('/feedback', {
      method: 'POST',
      body: feedbackData,
      requireAuth: true
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/feedback?${params.toString()}`, {
      method: 'GET',
      requireAuth: true
    });
  },

  getPublic: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/feedback/public?${params.toString()}`, {
      method: 'GET',
      requireAuth: false
    });
  },

  moderate: (feedbackId, action, adminNote = '') =>
    request(`/feedback/${feedbackId}/moderate`, {
      method: 'PUT',
      body: { action, adminNote },
      requireAuth: true
    })
};

// SETTINGS ENDPOINTS
export const settingsAPI = {
  get: () =>
    request('/settings', {
      method: 'GET',
      requireAuth: true
    }),

  update: (settings) =>
    request('/settings', {
      method: 'PUT',
      body: settings,
      requireAuth: true
    })
};
