const DEFAULT_API_BASE = "http://localhost:5000/api";
const API_BASE_KEY = "wds_api_base";
const CHAT_AUTH_KEY = "wds_chatbot_auth_token";
const AUTH_TOKEN_KEY = "wds_auth_token_v1";

// Increase request timeout and timeouts for better stability
const CHAT_MESSAGE_TIMEOUT = 15000; // 15 seconds
const API_RETRY_DELAY = 1000; // 1 second between retries
const API_MAX_RETRIES = 3;

function getApiBase() {
  if (window.WDS_API_BASE) {
    return String(window.WDS_API_BASE).replace(/\/+$/, "");
  }

  const stored = localStorage.getItem(API_BASE_KEY);
  if (stored) {
    return String(stored).replace(/\/+$/, "");
  }

  return DEFAULT_API_BASE;
}

function getApiBaseCandidates() {
  const sameOriginApi =
    window.location?.origin && /^https?:\/\//i.test(window.location.origin)
      ? `${window.location.origin.replace(/\/+$/, "")}/api`
      : "";

  const fallbackPorts = Array.from({ length: 6 }, (_, index) => 5000 + index);
  const fallbackCandidates = fallbackPorts.flatMap((port) => [
    `http://localhost:${port}/api`,
    `http://127.0.0.1:${port}/api`
  ]);

  const candidates = [
    window.WDS_API_BASE,
    localStorage.getItem(API_BASE_KEY),
    sameOriginApi,
    DEFAULT_API_BASE,
    ...fallbackCandidates
  ];

  return [...new Set(candidates.map((value) => String(value || "").replace(/\/+$/, "")).filter(Boolean))];
}

// Helper function to add timeout to fetch
async function fetchWithTimeout(url, options = {}, timeout = CHAT_MESSAGE_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const LANGUAGE_LABELS = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada"
};

const FALLBACK_TEXT = {
  en: {
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help.",
    schedule:
      "Pickup schedule: Wet waste daily 7am-10am, dry waste Tue/Thu/Sat 10am-2pm, e-waste every Friday 3pm-6pm.",
    segregation:
      "Segregation guide: Green bin for wet waste, blue bin for dry recyclables, red bin for hazardous items, and keep e-waste separate.",
    track: "To track complaint, share ticket ID in format CMP-YYYYMMDD-0001.",
    complaint: "Please share complaint details and location. You can also upload an image."
  },
  hi: {
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help.",
    schedule:
      "Pickup schedule: geela kachra daily 7am-10am, sukha kachra Tue/Thu/Sat 10am-2pm, e-waste Friday 3pm-6pm.",
    segregation:
      "Segregation guide: geela kachra green bin, dry recyclable blue bin, hazardous red bin, e-waste alag rakhein.",
    track: "Tracking ke liye ticket ID bhejein format CMP-YYYYMMDD-0001.",
    complaint: "Complaint detail aur location bhejein. Aap image bhi upload kar sakte hain."
  },
  kn: {
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help.",
    schedule:
      "Pickup schedule: wet waste daily 7am-10am, dry waste Tue/Thu/Sat 10am-2pm, e-waste Friday 3pm-6pm.",
    segregation:
      "Segregation guide: wet waste green bin, dry recyclable blue bin, hazardous red bin, e-waste bereyaagi ittkolli.",
    track: "Tracking ge ticket ID kodi format CMP-YYYYMMDD-0001.",
    complaint: "Complaint details mattu location kodi. Image upload maadabahudu."
  }
};

function getToken() {
  return localStorage.getItem(CHAT_AUTH_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function showNotification(text) {
  if (!("Notification" in window)) {
    return;
  }
  if (Notification.permission === "granted") {
    new Notification("Waste AI Assistant", { body: text });
  }
}

async function postChatMessage(payload) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const apiBases = [getApiBase(), ...getApiBaseCandidates()];
  const uniqueApiBases = [...new Set(apiBases.filter(Boolean))];
  let lastNetworkError = null;

  for (const base of uniqueApiBases) {
    for (let attempt = 0; attempt < API_MAX_RETRIES; attempt++) {
      try {
        const response = await fetchWithTimeout(`${base}/chatbot/message`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        }, CHAT_MESSAGE_TIMEOUT);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || `HTTP ${response.status}: Failed to get chatbot response`);
        }

        localStorage.setItem(API_BASE_KEY, base);
        window.WDS_API_BASE = base;
        return await response.json();
      } catch (error) {
        lastNetworkError = error;
        
        // Only retry on network errors, not on bad responses
        if (!(error instanceof TypeError) && !error.message.includes('AbortError')) {
          break;
        }
        
        // Wait before retrying
        if (attempt < API_MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, API_RETRY_DELAY));
        }
      }
    }
  }

  const connectionError = new Error('Service is temporarily unavailable. Please try again in a few moments.');
  connectionError.cause = lastNetworkError;
  throw connectionError;
}

function fallbackChatResponse(message, language) {
  const text = String(message || "").toLowerCase();
  const t = FALLBACK_TEXT[language] || FALLBACK_TEXT.en;

  if (/schedule|pickup time|collection/i.test(text)) {
    return t.schedule;
  }
  if (/segregation|separate|recycle|wet|dry/i.test(text)) {
    return t.segregation;
  }
  if (/track|status|ticket/i.test(text)) {
    return t.track;
  }
  if (/complaint|not collected|garbage|missed/i.test(text)) {
    return t.complaint;
  }

  return t.help;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
}

function createTypingBubble(container) {
  const bubble = document.createElement("div");
  bubble.className = "chat-msg bot typing";
  bubble.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function createMessageNode(role, text, extraClass = "") {
  const message = document.createElement("div");
  message.className = `chat-msg ${role} ${extraClass}`.trim();
  message.textContent = text;
  return message;
}

function injectChatbotMarkup() {
  const wrapper = document.createElement("section");
  wrapper.id = "smartChatbot";
  wrapper.innerHTML = `
    <button class="chatbot-backdrop hidden" id="chatbotBackdrop" type="button" aria-label="Close chatbot"></button>
    <button class="chatbot-fab modern" id="chatbotFab" type="button" aria-label="Open assistant">
      <span class="fab-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M9 3h6v2h-2v2.1a6.8 6.8 0 0 1 4.9 6.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6.4a6.8 6.8 0 0 1 4.9-6.5V5H9V3Zm1.5 8.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm3 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"></path>
        </svg>
      </span>
      <span class="fab-pulse"></span>
    </button>
    <div class="chatbot-panel modern hidden" id="chatbotPanel" aria-live="polite">
      <div class="chatbot-head modern">
        <div class="chat-head-content">
          <span class="chat-head-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 2a3 3 0 0 1 3 3v1.1a7 7 0 0 1 5 6.7V19a2 2 0 0 1-2 2h-3l-3 2-3-2H6a2 2 0 0 1-2-2v-6.2a7 7 0 0 1 5-6.7V5a3 3 0 0 1 3-3Zm-2.2 9.3a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm4.4 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"></path>
            </svg>
          </span>
          <div>
          <strong>Waste AI Assistant</strong>
          <p>Smart support for pickup, complaint, and tracking</p>
          </div>
        </div>
        <button id="chatbotClose" class="chat-close" type="button" aria-label="Close">x</button>
      </div>

      <div class="chat-quick-row" id="chatQuickRow">
        <button type="button" data-quick="Track complaint">Track</button>
        <button type="button" data-quick="Register complaint">Complaint</button>
        <button type="button" data-quick="Help">Help</button>
      </div>

      <div class="chatbot-messages modern" id="chatbotMessages"></div>

      <div class="chat-controls-row">
        <label class="chat-select-wrap" for="chatLanguageSelect">
          <span>Language</span>
          <select id="chatLanguageSelect">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
        </label>
        <button class="chat-icon-btn" id="chatVoiceBtn" type="button" title="Voice input">
          <i class="fa-solid fa-microphone"></i>
        </button>
        <label class="chat-icon-btn file-upload" title="Upload image">
          <input id="chatImageInput" type="file" accept="image/*" />
          <i class="fa-solid fa-image"></i>
        </label>
      </div>

      <form id="chatbotForm" class="chatbot-form modern">
        <input id="chatbotInput" placeholder="Ask about schedule, complaints, segregation..." autocomplete="off" required />
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  `;

  document.body.appendChild(wrapper);
}

export function initSmartChatbot() {
  if (document.getElementById("smartChatbot")) {
    return;
  }

  injectChatbotMarkup();

  const fab = document.getElementById("chatbotFab");
  const panel = document.getElementById("chatbotPanel");
  const backdrop = document.getElementById("chatbotBackdrop");
  const closeButton = document.getElementById("chatbotClose");
  const form = document.getElementById("chatbotForm");
  const input = document.getElementById("chatbotInput");
  const messages = document.getElementById("chatbotMessages");
  const imageInput = document.getElementById("chatImageInput");
  const voiceButton = document.getElementById("chatVoiceBtn");
  const languageSelect = document.getElementById("chatLanguageSelect");

  let imageDataUrl = "";
  let selectedLanguage = "en";

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }

  const addMessage = (role, text, extraClass = "") => {
    const node = createMessageNode(role, text, extraClass);
    messages?.appendChild(node);
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
    return node;
  };

  addMessage("bot", "Hello. I can register complaints, track tickets, and guide waste segregation.");

  const openPanel = () => {
    panel?.classList.remove("hidden");
    panel?.classList.add("opened");
    backdrop?.classList.remove("hidden");
    input?.focus();
  };

  const closePanel = () => {
    panel?.classList.add("hidden");
    panel?.classList.remove("opened");
    backdrop?.classList.add("hidden");
  };

  fab?.addEventListener("click", () => {
    if (panel?.classList.contains("hidden")) {
      openPanel();
      return;
    }
    closePanel();
  });

  closeButton?.addEventListener("click", closePanel);
  backdrop?.addEventListener("click", closePanel);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  languageSelect?.addEventListener("change", () => {
    selectedLanguage = String(languageSelect.value || "en");
    addMessage("bot", `Language changed to ${LANGUAGE_LABELS[selectedLanguage] || "English"}.`);
  });

  document.getElementById("chatQuickRow")?.addEventListener("click", (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest("button[data-quick]") : null;
    if (!button) {
      return;
    }
    const value = button.getAttribute("data-quick") || "";
    if (input) {
      input.value = value;
      input.focus();
    }
  });

  imageInput?.addEventListener("change", async () => {
    const file = imageInput.files?.[0];
    if (!file) {
      imageDataUrl = "";
      return;
    }

    try {
      imageDataUrl = await fileToDataUrl(file);
      addMessage("bot", "Image attached. Send your message when ready.");
    } catch (error) {
      addMessage("bot", error.message || "Image upload failed.");
      imageDataUrl = "";
    }
  });

  const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognitionApi) {
    const recognition = new SpeechRecognitionApi();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceButton?.addEventListener("click", () => {
      recognition.lang =
        selectedLanguage === "hi" ? "hi-IN" : selectedLanguage === "kn" ? "kn-IN" : "en-IN";
      recognition.start();
      voiceButton.classList.add("recording");
    });

    recognition.onresult = (event) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript || "").trim();
      if (!input || !transcript) {
        return;
      }
      input.value = transcript;
    };

    recognition.onerror = () => {
      addMessage("bot", "Voice input failed. Please type your message.");
      voiceButton?.classList.remove("recording");
    };

    recognition.onend = () => {
      voiceButton?.classList.remove("recording");
    };
  } else {
    voiceButton?.setAttribute("disabled", "true");
    voiceButton?.setAttribute("title", "Voice input is not supported in this browser.");
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!input || !messages) {
      return;
    }

    const message = input.value.trim();
    if (!message && !imageDataUrl) {
      return;
    }

    addMessage("user", message || "[image upload]");
    input.value = "";

    const typing = createTypingBubble(messages);

    try {
      const data = await postChatMessage({
        message,
        language: selectedLanguage,
        imageUrl: imageDataUrl
      });

      typing.remove();
      addMessage("bot", data.reply || "I am here to help.");

      if (data.complaint?.ticketId) {
        addMessage("bot", `Ticket generated: ${data.complaint.ticketId}`, "ticket");
        showNotification(`Complaint created: ${data.complaint.ticketId}`);
      }
    } catch (error) {
      typing.remove();
      const fallback = fallbackChatResponse(message, selectedLanguage);
      addMessage("bot", fallback);
    } finally {
      imageDataUrl = "";
      if (imageInput) {
        imageInput.value = "";
      }
    }
  });
}
