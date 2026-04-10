const INTENT_PATTERNS = {
  complaint: [
    /garbage not collected/i,
    /missed pickup/i,
    /complaint/i,
    /not collected/i,
    /dirty street/i,
    /overflow/i
  ],
  track: [/track/i, /status/i, /ticket/i, /complaint id/i],
  schedule: [/pickup schedule/i, /collection schedule/i, /when.*pickup/i],
  segregation: [/segregation/i, /separate waste/i, /dry and wet/i, /recycle/i],
  help: [/help/i, /assist/i, /support/i]
};

export function detectIntent(message) {
  const text = String(message || "");

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some((regex) => regex.test(text))) {
      return intent;
    }
  }

  return "general";
}

export function extractTicketId(message) {
  const match = String(message || "").match(/(CMP-[0-9]{8}-[0-9]{4,6})/i);
  return match ? match[1].toUpperCase() : "";
}

export function extractLocation(message) {
  const text = String(message || "").trim();
  if (!text) {
    return "";
  }

  const atMatch = text.match(/(?:at|near|location is)\s+(.+)/i);
  if (atMatch?.[1]) {
    return atMatch[1].trim();
  }

  if (text.split(" ").length >= 3) {
    return text;
  }

  return "";
}
