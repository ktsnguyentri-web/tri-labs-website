// ─────────────────────────────────────────────────────────────────────────────
// Tri Labs Chat — Configuration
// Fill in your credentials below before using the chat widget.
// ─────────────────────────────────────────────────────────────────────────────

export const CHAT_CONFIG = {
  // Pusher credentials — get these from https://dashboard.pusher.com
  PUSHER_APP_KEY: "YOUR_PUSHER_APP_KEY",
  PUSHER_CLUSTER: "YOUR_PUSHER_CLUSTER",     // e.g. "ap1", "us2", "eu"

  // Cloudflare Worker endpoint — the URL of your deployed Worker
  WORKER_ENDPOINT: "https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev/send",

  // Pusher channel & event names (must match your Worker config)
  CHANNEL: "chat-room",
  EVENT: "new-message",
} as const;
