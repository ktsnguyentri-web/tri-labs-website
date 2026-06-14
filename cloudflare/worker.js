/**
 * Tri Labs — Cloudflare Worker  (v3 — production-ready)
 *
 * ┌─ POST (from website)          → send to Telegram + echo to Pusher channel
 * ├─ POST (Telegram webhook)      → extract #SESSION_ID → Pusher bot-reply
 * ├─ GET                          → health check
 * └─ OPTIONS                      → CORS preflight
 *
 * Environment Variables  (Cloudflare dashboard → Settings → Variables):
 *   TELEGRAM_TOKEN   – bot token
 *   TELEGRAM_CHAT_ID – owner Telegram user ID  (6247777053)
 *   PUSHER_APP_ID    – Pusher app ID
 *   PUSHER_KEY       – Pusher app key
 *   PUSHER_SECRET    – Pusher app secret
 *   PUSHER_CLUSTER   – Pusher cluster  (ap1)
 */

// ─── CORS — wildcard, required for localhost + production ─────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function makeJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ─── HMAC-SHA256  (Web Crypto API — native in Cloudflare Workers) ─────────────

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── MD5  (RFC 1321 — pure JS, Unicode-safe via TextEncoder) ─────────────────
//
// Critical fix vs. the broken previous version:
//   OLD: Uint32Array(l32 + 16)          ← too small for messages ≥ 56 bytes
//        into the last block; the bit-length word was written out-of-bounds
//        (silent no-op in TypedArrays) → wrong digest → Pusher 400.
//
//   NEW: Math.ceil((len + 9) / 64) * 16 ← always allocates the correct number
//        of complete 512-bit blocks per RFC 1321, regardless of message length.
//
// TextEncoder.encode() produces UTF-8 bytes, so Vietnamese / emoji are handled
// correctly — no character-code truncation at codepoint > 0xFF.

function computeMd5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xffff;
  }
  function rol(n, c)              { return n << c | n >>> (32 - c); }
  function cmn(q, a, b, x, s, t) { return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function ff(a,b,c,d,x,s,t) { return cmn( b&c | ~b&d, a,b,x,s,t); }
  function gg(a,b,c,d,x,s,t) { return cmn( b&d | c&~d, a,b,x,s,t); }
  function hh(a,b,c,d,x,s,t) { return cmn( b^c^d,      a,b,x,s,t); }
  function ii(a,b,c,d,x,s,t) { return cmn( c^(b|~d),   a,b,x,s,t); }

  const bytes   = new TextEncoder().encode(str);
  const len     = bytes.length;
  const nblocks = Math.ceil((len + 9) / 64);   // complete 64-byte blocks needed
  const w       = new Uint32Array(nblocks * 16);

  for (let i = 0; i < len; i++) w[i >> 2] |= bytes[i] << (i % 4 * 8);
  w[len >> 2] |= 0x80 << (len % 4 * 8);        // append 0x80 padding byte
  w[nblocks * 16 - 2] = len * 8;               // 64-bit bit-length (low word)

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < w.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d];
    a=ff(a,b,c,d,w[i+ 0], 7,-680876936);  d=ff(d,a,b,c,w[i+ 1],12,-389564586);
    c=ff(c,d,a,b,w[i+ 2],17, 606105819);  b=ff(b,c,d,a,w[i+ 3],22,-1044525330);
    a=ff(a,b,c,d,w[i+ 4], 7,-176418897);  d=ff(d,a,b,c,w[i+ 5],12,1200080426);
    c=ff(c,d,a,b,w[i+ 6],17,-1473231341); b=ff(b,c,d,a,w[i+ 7],22,-45705983);
    a=ff(a,b,c,d,w[i+ 8], 7,1770035416);  d=ff(d,a,b,c,w[i+ 9],12,-1958414417);
    c=ff(c,d,a,b,w[i+10],17,-42063);       b=ff(b,c,d,a,w[i+11],22,-1990404162);
    a=ff(a,b,c,d,w[i+12], 7,1804603682);  d=ff(d,a,b,c,w[i+13],12,-40341101);
    c=ff(c,d,a,b,w[i+14],17,-1502002290); b=ff(b,c,d,a,w[i+15],22,1236535329);
    a=gg(a,b,c,d,w[i+ 1], 5,-165796510);  d=gg(d,a,b,c,w[i+ 6], 9,-1069501632);
    c=gg(c,d,a,b,w[i+11],14, 643717713);  b=gg(b,c,d,a,w[i+ 0],20,-373897302);
    a=gg(a,b,c,d,w[i+ 5], 5,-701558691);  d=gg(d,a,b,c,w[i+10], 9,38016083);
    c=gg(c,d,a,b,w[i+15],14,-660478335);  b=gg(b,c,d,a,w[i+ 4],20,-405537848);
    a=gg(a,b,c,d,w[i+ 9], 5, 568446438);  d=gg(d,a,b,c,w[i+14], 9,-1019803690);
    c=gg(c,d,a,b,w[i+ 3],14,-187363961);  b=gg(b,c,d,a,w[i+ 8],20,1163531501);
    a=gg(a,b,c,d,w[i+13], 5,-1444681467); d=gg(d,a,b,c,w[i+ 2], 9,-51403784);
    c=gg(c,d,a,b,w[i+ 7],14,1735328473);  b=gg(b,c,d,a,w[i+12],20,-1926607734);
    a=hh(a,b,c,d,w[i+ 5], 4,-378558);     d=hh(d,a,b,c,w[i+ 8],11,-2022574463);
    c=hh(c,d,a,b,w[i+11],16,1839030562);  b=hh(b,c,d,a,w[i+14],23,-35309556);
    a=hh(a,b,c,d,w[i+ 1], 4,-1530992060); d=hh(d,a,b,c,w[i+ 4],11,1272893353);
    c=hh(c,d,a,b,w[i+ 7],16,-155497632);  b=hh(b,c,d,a,w[i+10],23,-1094730640);
    a=hh(a,b,c,d,w[i+13], 4, 681279174);  d=hh(d,a,b,c,w[i+ 0],11,-358537222);
    c=hh(c,d,a,b,w[i+ 3],16,-722521979);  b=hh(b,c,d,a,w[i+ 6],23,76029189);
    a=hh(a,b,c,d,w[i+ 9], 4,-640364487);  d=hh(d,a,b,c,w[i+12],11,-421815835);
    c=hh(c,d,a,b,w[i+15],16, 530742520);  b=hh(b,c,d,a,w[i+ 2],23,-995338651);
    a=ii(a,b,c,d,w[i+ 0], 6,-198630844);  d=ii(d,a,b,c,w[i+ 7],10,1126891415);
    c=ii(c,d,a,b,w[i+14],15,-1416354905); b=ii(b,c,d,a,w[i+ 5],21,-57434055);
    a=ii(a,b,c,d,w[i+12], 6,1700485571);  d=ii(d,a,b,c,w[i+ 3],10,-1894986606);
    c=ii(c,d,a,b,w[i+10],15,-1051523);    b=ii(b,c,d,a,w[i+ 1],21,-2054922799);
    a=ii(a,b,c,d,w[i+ 8], 6,1873313359);  d=ii(d,a,b,c,w[i+15],10,-30611744);
    c=ii(c,d,a,b,w[i+ 6],15,-1560198380); b=ii(b,c,d,a,w[i+13],21,1309151649);
    a=ii(a,b,c,d,w[i+ 4], 6,-145523070);  d=ii(d,a,b,c,w[i+11],10,-1120210379);
    c=ii(c,d,a,b,w[i+ 2],15, 718787259);  b=ii(b,c,d,a,w[i+ 9],21,-343485551);
    a=safeAdd(a,oa); b=safeAdd(b,ob); c=safeAdd(c,oc); d=safeAdd(d,od);
  }

  return [a, b, c, d]
    .map(n => Array.from(
      { length: 4 },
      (_, i) => ((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0"),
    ).join(""))
    .join("");
}

// ─── Pusher Server-Side Trigger  (no SDK — SubtleCrypto HMAC + inline MD5) ────
//
// Pusher REST API auth steps:
//   1. body_md5   = MD5(raw JSON body string)
//   2. stringToSign = "POST\n/apps/{appId}/events\n" + sorted query params incl. body_md5
//   3. auth_signature = HMAC-SHA256(pusherSecret, stringToSign)
//   4. Send POST with all params in query string + raw body

async function triggerPusher(channel, eventName, data, env) {
  const appId   = env.PUSHER_APP_ID;
  const key     = env.PUSHER_KEY;
  const secret  = env.PUSHER_SECRET;
  const cluster = env.PUSHER_CLUSTER;

  // The body string must be identical for both MD5 calculation and fetch body.
  const body      = JSON.stringify({ name: eventName, channel, data: JSON.stringify(data) });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyMd5   = computeMd5(body);  // synchronous, correct for all Unicode

  // Query params must be alphabetically sorted for the signature to be valid.
  const stringToSign =
    `POST\n/apps/${appId}/events\n` +
    `auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5}`;

  const signature = await hmacSha256(secret, stringToSign);

  const url =
    `https://api-${cluster}.pusher.com/apps/${appId}/events` +
    `?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0` +
    `&body_md5=${bodyMd5}&auth_signature=${signature}`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Pusher ${res.status}: ${errText}`);
  }
}

// ─── Telegram Webhook Handler ─────────────────────────────────────────────────
//
// Called when Telegram POSTs an update to this Worker URL (after setWebhook).
// Security: only messages FROM the owner (TELEGRAM_CHAT_ID = 6247777053) are
// processed — anyone else gets a 200 OK with no side-effects.
//
// Flow:
//   1. Owner taps "Reply" on a visitor message in Telegram
//   2. Telegram sends update with message.reply_to_message.text containing #ID-xxxxx
//   3. Worker extracts the session ID and fires Pusher event on chat-{sessionId}
//   4. ChatWidget receives bot-reply event and displays the message in real-time

async function handleWebhook(update, env) {
  const message = update?.message;
  if (!message) return makeJson({ ok: true });  // not a text message, ignore silently

  const fromId  = String(message.from?.id ?? "");
  const ownerId = String(env.TELEGRAM_CHAT_ID);

  // ── Security gate ─────────────────────────────────────────────────────────
  if (fromId !== ownerId) {
    console.warn("[Webhook] Rejected — sender is not the owner:", fromId);
    return makeJson({ ok: true });  // always 200 so Telegram doesn't retry
  }

  // ── Validate: must be a Reply to a message containing #ID-xxxxx ──────────
  const quotedText   = message.reply_to_message?.text ?? "";
  const sessionMatch = quotedText.match(/#(ID-[a-z0-9]+)/i);

  if (!sessionMatch) {
    console.log("[Webhook] No #ID tag in quoted message — skipping Pusher.");
    return makeJson({ ok: true });
  }

  const sessionId = sessionMatch[1];                    // e.g. "ID-tsb4g"
  const replyText = (message.text ?? "").trim();

  if (!replyText) return makeJson({ ok: true });

  // ── Push reply to visitor's Pusher channel ────────────────────────────────
  const channel = `chat-${sessionId}`;                  // e.g. "chat-ID-tsb4g"
  try {
    await triggerPusher(channel, "bot-reply", { text: replyText, sender: "support" }, env);
    console.log(`[Webhook] bot-reply → ${channel}: "${replyText.slice(0, 60)}"`);
  } catch (e) {
    console.error("[Webhook] Pusher trigger failed:", e.message);
    // Still return 200 so Telegram doesn't retry the webhook endlessly.
  }

  return makeJson({ ok: true });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {

    // ── CORS preflight ───────────────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── Health check ─────────────────────────────────────────────────────────
    if (request.method === "GET") {
      return new Response("Tri Labs Worker is running ✓", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    if (request.method !== "POST") {
      return makeJson({ error: "Method Not Allowed" }, 405);
    }

    try {
      // ── Parse JSON body ────────────────────────────────────────────────────
      let body;
      try {
        body = await request.json();
      } catch {
        return makeJson({ error: "Invalid JSON body" }, 400);
      }

      // ── Route: Telegram Webhook (Telegram always includes update_id) ───────
      if (body.update_id !== undefined) {
        return handleWebhook(body, env);
      }

      // ── Route: Website → Telegram ──────────────────────────────────────────
      const msgText   = (body.text       || "").trim();
      const sender    = (body.sender     || "user").trim();
      const sessionId = (body.session_id || "unknown").trim();

      if (!msgText) return makeJson({ error: "Empty message" }, 400);

      // Step 1 — Forward to Telegram.
      //   Embed #SESSION_ID in the message text so when the owner hits "Reply"
      //   in Telegram, the quoted text contains the tag for session routing.
      const tgRes = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id:    env.TELEGRAM_CHAT_ID,
            text:       `💬 [Tri Labs Chat]\nUser: #${sessionId}\n\n${msgText}`,
            parse_mode: "HTML",
          }),
        },
      );

      if (!tgRes.ok) {
        const detail = await tgRes.text();
        console.error("[Telegram] delivery failed:", tgRes.status, detail);
        return makeJson({ error: "Telegram delivery failed", detail }, 502);
      }

      // Step 2 — Echo to visitor's Pusher channel (non-fatal: won't break ok:true).
      //   Channel: chat-{sessionId}   Event: new-message
      try {
        await triggerPusher(
          `chat-${sessionId}`,
          "new-message",
          { text: msgText, sender },
          env,
        );
      } catch (e) {
        console.error("[Pusher] echo failed (non-fatal):", e.message);
      }

      return makeJson({ ok: true });

    } catch (e) {
      console.error("[Worker] Unhandled error:", e.message, e.stack);
      return makeJson({ error: "Internal error", detail: e.message }, 500);
    }
  },
};
