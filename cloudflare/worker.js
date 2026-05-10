/**
 * Tri Labs — Cloudflare Worker
 *
 * Two POST routes:
 *   1. Website → Worker  : sends visitor message to Telegram
 *   2. Telegram → Worker : webhook — routes owner replies back to visitor via Pusher
 *
 * Env vars (Cloudflare dashboard → Settings → Variables):
 *   TELEGRAM_TOKEN, TELEGRAM_CHAT_ID,
 *   PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
 */

// ─── CORS — wildcard, applied to every single response ───────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function makeJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ─── Pusher Server-Side Trigger (no SDK — SubtleCrypto + inline MD5) ─────────

async function triggerPusher(channel, eventName, data, env) {
  const appId   = env.PUSHER_APP_ID;
  const key     = env.PUSHER_KEY;
  const secret  = env.PUSHER_SECRET;
  const cluster = env.PUSHER_CLUSTER;

  const body      = JSON.stringify({ name: eventName, channel, data: JSON.stringify(data) });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyMd5   = computeMd5(body);

  const stringToSign = `POST\n/apps/${appId}/events\nauth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5}`;
  const signature    = await hmacSha256(secret, stringToSign);

  const url = `https://api-${cluster}.pusher.com/apps/${appId}/events`
    + `?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5}&auth_signature=${signature}`;

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

// ─── MD5 (RFC 1321 — pure JS, correct buffer sizing) ─────────────────────────
//
// Root cause of "Invalid body_md5": the previous buffer was Uint32Array(l32+16).
// When the UTF-8 message fills ≥56 bytes of the last 64-byte block, MD5 needs an
// extra block for padding + length. Writing past the end of a TypedArray is a
// silent no-op, so the bit-length word was lost → wrong digest every time.
//
// Fix: nblocks = Math.ceil((byteLen + 9) / 64)  — always allocates the right
// number of complete 512-bit (64-byte / 16-word) blocks per the spec.

function computeMd5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | lsw & 0xffff;
  }
  function rol(n, c)             { return n << c | n >>> (32 - c); }
  function cmn(q, a, b, x, s, t){ return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function ff(a,b,c,d,x,s,t){ return cmn( b&c | ~b&d,  a,b,x,s,t); }
  function gg(a,b,c,d,x,s,t){ return cmn( b&d | c&~d,  a,b,x,s,t); }
  function hh(a,b,c,d,x,s,t){ return cmn( b^c^d,        a,b,x,s,t); }
  function ii(a,b,c,d,x,s,t){ return cmn( c^(b|~d),     a,b,x,s,t); }

  // UTF-8 encode (handles Vietnamese and all Unicode correctly)
  const bytes   = new TextEncoder().encode(str);
  const len     = bytes.length;

  // Allocate enough 32-bit words for: message + 0x80 byte + zero pad + 64-bit length
  const nblocks = Math.ceil((len + 9) / 64); // number of 64-byte blocks
  const w       = new Uint32Array(nblocks * 16);

  // Load message bytes into little-endian 32-bit words
  for (let i = 0; i < len; i++) w[i >> 2] |= bytes[i] << (i % 4 * 8);

  // Append 0x80 padding byte immediately after the message
  w[len >> 2] |= 0x80 << (len % 4 * 8);

  // Append bit-length as 64-bit little-endian at the last two words of the last block
  // (high word is always 0 for messages we'll ever send)
  w[nblocks * 16 - 2] = len * 8; // low 32 bits of bit-length

  // MD5 compression
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

  // Serialise four 32-bit words as 32 lowercase hex chars (little-endian per word)
  return [a, b, c, d]
    .map(n => Array.from({length: 4}, (_, i) => ((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0")).join(""))
    .join("");
}

// ─── Telegram Webhook Handler ─────────────────────────────────────────────────
// Called when Telegram POSTs an update to this Worker URL.
// Extracts the session ID from the replied-to message and pushes a Pusher event.

async function handleWebhook(update, env) {
  const message = update?.message;
  if (!message) return makeJson({ ok: true }); // not a message update, ignore

  const fromId   = String(message.from?.id  ?? "");
  const ownerId  = String(env.TELEGRAM_CHAT_ID);

  // ── Security: only process messages sent BY the owner ──────────────────────
  if (fromId !== ownerId) {
    console.warn("[Webhook] Ignored message from non-owner:", fromId);
    return makeJson({ ok: true }); // always 200 to Telegram
  }

  const replyText = message.reply_to_message?.text ?? "";

  // Extract #ID-xxxxx tag embedded in the original visitor message
  const sessionMatch = replyText.match(/#(ID-[a-z0-9]+)/i);
  if (!sessionMatch) {
    console.log("[Webhook] Owner message has no #ID tag — skipping Pusher.");
    return makeJson({ ok: true });
  }

  const sessionId = sessionMatch[1];          // e.g. "ID-a7b2c"
  const replyBody = (message.text ?? "").trim();

  if (!replyBody) return makeJson({ ok: true });

  // Push reply to the visitor's personal Pusher channel
  const channel = `chat-${sessionId}`;       // e.g. "chat-ID-a7b2c"
  try {
    await triggerPusher(channel, "bot-reply", { text: replyBody, sender: "support" }, env);
    console.log(`[Webhook] Pushed bot-reply → ${channel}`);
  } catch (e) {
    console.error("[Webhook] Pusher error:", e.message);
  }

  return makeJson({ ok: true });
}

// ─── Main Handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (request.method === "GET") {
      return new Response("Tri Labs Worker is running ✓", { status: 200, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return makeJson({ error: "Method Not Allowed" }, 405);
    }

    try {
      // Parse body
      let body;
      try {
        body = await request.json();
      } catch {
        return makeJson({ error: "Invalid JSON body" }, 400);
      }

      // ── Route: Telegram Webhook (has update_id field) ───────────────────────
      if (body.update_id !== undefined) {
        return handleWebhook(body, env);
      }

      // ── Route: Website → Telegram ───────────────────────────────────────────
      const msgText   = (body.text       || "").trim();
      const sender    = (body.sender     || "user").trim();
      const sessionId = (body.session_id || "unknown").trim();

      if (!msgText) return makeJson({ error: "Empty message" }, 400);

      // Step 1 — Send to Telegram (embed session ID as a tag for webhook reply routing)
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
        }
      );

      if (!tgRes.ok) {
        const detail = await tgRes.text();
        console.error("[Telegram] failed:", tgRes.status, detail);
        return makeJson({ error: "Telegram delivery failed", detail }, 502);
      }

      // Step 2 — Echo to the visitor's own Pusher channel (non-fatal)
      try {
        await triggerPusher(`chat-${sessionId}`, "new-message", { text: msgText, sender }, env);
      } catch (e) {
        console.error("[Pusher] non-fatal error:", e.message);
      }

      return makeJson({ ok: true });

    } catch (e) {
      console.error("[Worker] Unhandled error:", e.message, e.stack);
      return makeJson({ error: "Internal error", detail: e.message }, 500);
    }
  },
};
