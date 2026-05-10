/**
 * Tri Labs — Cloudflare Worker
 * 
 * Receives a chat message from the website, forwards it to a Telegram bot,
 * then triggers a Pusher event so the message appears live on the frontend.
 * 
 * Environment Variables to set in Cloudflare Worker Settings:
 *   TELEGRAM_TOKEN     — your bot token from @BotFather
 *   TELEGRAM_CHAT_ID   — the chat/group ID to send messages to
 *   PUSHER_APP_ID      — from Pusher dashboard
 *   PUSHER_KEY         — from Pusher dashboard (same as frontend key)
 *   PUSHER_SECRET      — from Pusher dashboard (keep this server-side only!)
 *   PUSHER_CLUSTER     — e.g. "ap1"
 *   ALLOWED_ORIGIN     — your site URL, e.g. "https://tri-labs.com"
 */

// ─── CORS Headers ─────────────────────────────────────────────────────────────

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ─── Pusher Server-Side Trigger ────────────────────────────────────────────────
// Implements Pusher's HTTP API auth signature using SubtleCrypto (no SDK needed)

async function triggerPusher(env, channel, eventName, data) {
  const appId   = env.PUSHER_APP_ID;
  const key     = env.PUSHER_KEY;
  const secret  = env.PUSHER_SECRET;
  const cluster = env.PUSHER_CLUSTER;

  const body      = JSON.stringify({ name: eventName, channel, data: JSON.stringify(data) });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const md5Body   = await md5(body);

  const stringToSign = [
    "POST",
    `/apps/${appId}/events`,
    `auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${md5Body}`,
  ].join("\n");

  const signature = await hmacSha256(secret, stringToSign);

  const url = `https://api-${cluster}.pusher.com/apps/${appId}/events`
    + `?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${md5Body}&auth_signature=${signature}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pusher trigger failed: ${res.status} ${text}`);
  }
}

// ─── Crypto Helpers ────────────────────────────────────────────────────────────

async function hmacSha256(secret, message) {
  const enc     = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData,
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function md5(message) {
  // Cloudflare Workers do not natively support MD5 via SubtleCrypto,
  // so we compute it manually using a lightweight implementation.
  const bytes = new TextEncoder().encode(message);
  return computeMd5(bytes);
}

// Lightweight MD5 (RFC 1321) — no external dependency required
function computeMd5(input) {
  function safeAdd(x, y) { const l = (x & 0xffff) + (y & 0xffff); return ((x >> 16) + (y >> 16) + (l >> 16)) << 16 | l & 0xffff; }
  function bitRotate(num, cnt) { return num << cnt | num >>> (32 - cnt); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotate(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a,b,c,d,x,s,t){return md5cmn(b&c|~b&d,a,b,x,s,t);}
  function md5gg(a,b,c,d,x,s,t){return md5cmn(b&d|c&~d,a,b,x,s,t);}
  function md5hh(a,b,c,d,x,s,t){return md5cmn(b^c^d,a,b,x,s,t);}
  function md5ii(a,b,c,d,x,s,t){return md5cmn(c^(b|~d),a,b,x,s,t);}

  const len8 = input.length;
  const len32 = len8 >> 2;
  const data = new Uint32Array(len32 + 16);
  for (let i = 0; i < len8; i++) data[i >> 2] |= input[i] << (i % 4 * 8);
  data[len8 >> 2] |= 0x80 << (len8 % 4 * 8);
  data[len32 + (len32 % 16 > 13 ? 16 - len32 % 16 + 14 : 14 - len32 % 16)] = len8 * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;

  for (let i = 0; i < data.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d];
    a=md5ff(a,b,c,d,data[i+0],7,-680876936);d=md5ff(d,a,b,c,data[i+1],12,-389564586);c=md5ff(c,d,a,b,data[i+2],17,606105819);b=md5ff(b,c,d,a,data[i+3],22,-1044525330);
    a=md5ff(a,b,c,d,data[i+4],7,-176418897);d=md5ff(d,a,b,c,data[i+5],12,1200080426);c=md5ff(c,d,a,b,data[i+6],17,-1473231341);b=md5ff(b,c,d,a,data[i+7],22,-45705983);
    a=md5ff(a,b,c,d,data[i+8],7,1770035416);d=md5ff(d,a,b,c,data[i+9],12,-1958414417);c=md5ff(c,d,a,b,data[i+10],17,-42063);b=md5ff(b,c,d,a,data[i+11],22,-1990404162);
    a=md5ff(a,b,c,d,data[i+12],7,1804603682);d=md5ff(d,a,b,c,data[i+13],12,-40341101);c=md5ff(c,d,a,b,data[i+14],17,-1502002290);b=md5ff(b,c,d,a,data[i+15],22,1236535329);
    a=md5gg(a,b,c,d,data[i+1],5,-165796510);d=md5gg(d,a,b,c,data[i+6],9,-1069501632);c=md5gg(c,d,a,b,data[i+11],14,643717713);b=md5gg(b,c,d,a,data[i+0],20,-373897302);
    a=md5gg(a,b,c,d,data[i+5],5,-701558691);d=md5gg(d,a,b,c,data[i+10],9,38016083);c=md5gg(c,d,a,b,data[i+15],14,-660478335);b=md5gg(b,c,d,a,data[i+4],20,-405537848);
    a=md5gg(a,b,c,d,data[i+9],5,568446438);d=md5gg(d,a,b,c,data[i+14],9,-1019803690);c=md5gg(c,d,a,b,data[i+3],14,-187363961);b=md5gg(b,c,d,a,data[i+8],20,1163531501);
    a=md5gg(a,b,c,d,data[i+13],5,-1444681467);d=md5gg(d,a,b,c,data[i+2],9,-51403784);c=md5gg(c,d,a,b,data[i+7],14,1735328473);b=md5gg(b,c,d,a,data[i+12],20,-1926607734);
    a=md5hh(a,b,c,d,data[i+5],4,-378558);d=md5hh(d,a,b,c,data[i+8],11,-2022574463);c=md5hh(c,d,a,b,data[i+11],16,1839030562);b=md5hh(b,c,d,a,data[i+14],23,-35309556);
    a=md5hh(a,b,c,d,data[i+1],4,-1530992060);d=md5hh(d,a,b,c,data[i+4],11,1272893353);c=md5hh(c,d,a,b,data[i+7],16,-155497632);b=md5hh(b,c,d,a,data[i+10],23,-1094730640);
    a=md5hh(a,b,c,d,data[i+13],4,681279174);d=md5hh(d,a,b,c,data[i+0],11,-358537222);c=md5hh(c,d,a,b,data[i+3],16,-722521979);b=md5hh(b,c,d,a,data[i+6],23,76029189);
    a=md5hh(a,b,c,d,data[i+9],4,-640364487);d=md5hh(d,a,b,c,data[i+12],11,-421815835);c=md5hh(c,d,a,b,data[i+15],16,530742520);b=md5hh(b,c,d,a,data[i+2],23,-995338651);
    a=md5ii(a,b,c,d,data[i+0],6,-198630844);d=md5ii(d,a,b,c,data[i+7],10,1126891415);c=md5ii(c,d,a,b,data[i+14],15,-1416354905);b=md5ii(b,c,d,a,data[i+5],21,-57434055);
    a=md5ii(a,b,c,d,data[i+12],6,1700485571);d=md5ii(d,a,b,c,data[i+3],10,-1894986606);c=md5ii(c,d,a,b,data[i+10],15,-1051523);b=md5ii(b,c,d,a,data[i+1],21,-2054922799);
    a=md5ii(a,b,c,d,data[i+8],6,1873313359);d=md5ii(d,a,b,c,data[i+15],10,-30611744);c=md5ii(c,d,a,b,data[i+6],15,-1560198380);b=md5ii(b,c,d,a,data[i+13],21,1309151649);
    a=md5ii(a,b,c,d,data[i+4],6,-145523070);d=md5ii(d,a,b,c,data[i+11],10,-1120210379);c=md5ii(c,d,a,b,data[i+2],15,718787259);b=md5ii(b,c,d,a,data[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }

  return [a,b,c,d].map(n => {
    let hex = "";
    for (let i = 0; i < 4; i++) hex += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    return hex;
  }).join("");
}

// ─── Main Handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const text   = (body.text   || "").trim();
    const sender = (body.sender || "user").trim();

    if (!text) {
      return new Response(JSON.stringify({ error: "Empty message" }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // 1. Forward to Telegram
    const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;
    const telegramRes = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: `💬 [Tri Labs Chat]\nFrom: ${sender}\n\n${text}`,
        parse_mode: "HTML",
      }),
    });

    if (!telegramRes.ok) {
      const err = await telegramRes.text();
      return new Response(JSON.stringify({ error: "Telegram failed", detail: err }), {
        status: 502, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // 2. Broadcast via Pusher so the UI updates in real-time
    try {
      await triggerPusher(env, "chat-room", "new-message", { text, sender });
    } catch (e) {
      // Log but don't fail the request — Telegram already received the message
      console.error("Pusher error:", e.message);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
