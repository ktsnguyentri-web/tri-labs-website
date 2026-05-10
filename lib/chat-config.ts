// ─────────────────────────────────────────────────────────────────────────────
// Tri Labs Chat — Configuration
// Fill in your credentials below before using the chat widget.
// ─────────────────────────────────────────────────────────────────────────────

export const CHAT_CONFIG = {
  // Pusher credentials — get these from https://dashboard.pusher.com
  PUSHER_APP_KEY: "19d32477f5acc14b340e",
  PUSHER_CLUSTER: "ap1",

  // Cloudflare Worker endpoint — the URL of your deployed Worker
  WORKER_ENDPOINT: "https://trilabs.kts-nguyentri.workers.dev/send",

  // Pusher channel & event names (must match your Worker config)
  CHANNEL: "chat-room",
  EVENT: "new-message",
} as const;
