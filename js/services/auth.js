// Auth service - manages authentication state

import { authAPI, setAuthToken, getAuthToken } from './api.js';

const SESSION_KEY = 'wds_session_v1';

export async function login(email, password) {
  const response = await authAPI.login(email, password);
  
  if (response.token) {
    setAuthToken(response.token);
    setSessionUser(response.user);
  }
  
  return response.user;
}

export async function register(name, email, phone, password, address) {
  const response = await authAPI.register(name, email, phone, password, address);
  
  if (response.token) {
    setAuthToken(response.token);
    setSessionUser(response.user);
  }
  
  return response.user;
}

export function setSessionUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSessionUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted session data should not break the UI.
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function getActiveSessionUser() {
  const token = getAuthToken();
  const session = getSessionUser();

  if (!session) {
    return null;
  }

  if (!token) {
    logout();
    return null;
  }

  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  setAuthToken(null);
}

export function isLoggedIn() {
  return !!getActiveSessionUser();
}

export function getCurrentUser() {
  return getSessionUser();
}
