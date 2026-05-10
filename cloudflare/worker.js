/**
 * Tri Labs — Cloudflare Worker (Hardened)
 * Receives POST → sends to Telegram → triggers Pusher event.
 *
 * Set these Environment Variables in Cloudflare Worker dashboard:
 *   TELEGRAM_TOKEN    — bot token from @BotFather
 *   TELEGRAM_CHAT_ID  — your chat/group ID
 *   PUSHER_APP_ID     — from pusher.com dashboard
 *   PUSHER_KEY        — from pusher.com dashboard
 *   PUSHER_SECRET     — from pusher.com dashboard (server-side only)
 *   PUSHER_CLUSTER    — e.g. "ap1"
 */

// ─── CORS — wildcard to allow localhost:3000 and all origins ──────────────────

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function text(msg, status = 200) {
  return new Response(msg, { status, headers: CORS });
}

// ─── Pusher Server Trigger (no SDK — uses SubtleCrypto + inline MD5) ──────────

async function triggerPusher(env, channel, eventName, data) {
  const { PUSHER_APP_ID: appId, PUSHER_KEY: key, PUSHER_SECRET: secret, PUSHER_CLUSTER: cluster } = env;

  const body      = JSON.stringify({ name: eventName, channel, data: JSON.stringify(data) });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyMd5   = await md5(body);

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
    const err = await res.text();
    console.error("[Pusher] trigger failed:", res.status, err);
    throw new Error(`Pusher ${res.status}: ${err}`);
  }
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function md5(str) {
  const bytes = new TextEncoder().encode(str);
  return computeMd5(bytes);
}

function computeMd5(input) {
  function safeAdd(x,y){const l=(x&0xffff)+(y&0xffff);return((x>>16)+(y>>16)+(l>>16))<<16|l&0xffff;}
  function bitRotate(num,cnt){return num<<cnt|num>>>(32-cnt);}
  function md5cmn(q,a,b,x,s,t){return safeAdd(bitRotate(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t){return md5cmn(b&c|~b&d,a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return md5cmn(b&d|c&~d,a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return md5cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return md5cmn(c^(b|~d),a,b,x,s,t);}

  const len8=input.length,len32=len8>>2;
  const d=new Uint32Array(len32+16);
  for(let i=0;i<len8;i++)d[i>>2]|=input[i]<<(i%4*8);
  d[len8>>2]|=0x80<<(len8%4*8);
  d[len32+(len32%16>13?16-len32%16+14:14-len32%16)]=len8*8;

  let a=1732584193,b=-271733879,c=-1732584194,e=271733878;
  for(let i=0;i<d.length;i+=16){
    const [oa,ob,oc,oe]=[a,b,c,e];
    a=ff(a,b,c,e,d[i+0],7,-680876936);e=ff(e,a,b,c,d[i+1],12,-389564586);c=ff(c,e,a,b,d[i+2],17,606105819);b=ff(b,c,e,a,d[i+3],22,-1044525330);
    a=ff(a,b,c,e,d[i+4],7,-176418897);e=ff(e,a,b,c,d[i+5],12,1200080426);c=ff(c,e,a,b,d[i+6],17,-1473231341);b=ff(b,c,e,a,d[i+7],22,-45705983);
    a=ff(a,b,c,e,d[i+8],7,1770035416);e=ff(e,a,b,c,d[i+9],12,-1958414417);c=ff(c,e,a,b,d[i+10],17,-42063);b=ff(b,c,e,a,d[i+11],22,-1990404162);
    a=ff(a,b,c,e,d[i+12],7,1804603682);e=ff(e,a,b,c,d[i+13],12,-40341101);c=ff(c,e,a,b,d[i+14],17,-1502002290);b=ff(b,c,e,a,d[i+15],22,1236535329);
    a=gg(a,b,c,e,d[i+1],5,-165796510);e=gg(e,a,b,c,d[i+6],9,-1069501632);c=gg(c,e,a,b,d[i+11],14,643717713);b=gg(b,c,e,a,d[i+0],20,-373897302);
    a=gg(a,b,c,e,d[i+5],5,-701558691);e=gg(e,a,b,c,d[i+10],9,38016083);c=gg(c,e,a,b,d[i+15],14,-660478335);b=gg(b,c,e,a,d[i+4],20,-405537848);
    a=gg(a,b,c,e,d[i+9],5,568446438);e=gg(e,a,b,c,d[i+14],9,-1019803690);c=gg(c,e,a,b,d[i+3],14,-187363961);b=gg(b,c,e,a,d[i+8],20,1163531501);
    a=gg(a,b,c,e,d[i+13],5,-1444681467);e=gg(e,a,b,c,d[i+2],9,-51403784);c=gg(c,e,a,b,d[i+7],14,1735328473);b=gg(b,c,e,a,d[i+12],20,-1926607734);
    a=hh(a,b,c,e,d[i+5],4,-378558);e=hh(e,a,b,c,d[i+8],11,-2022574463);c=hh(c,e,a,b,d[i+11],16,1839030562);b=hh(b,c,e,a,d[i+14],23,-35309556);
    a=hh(a,b,c,e,d[i+1],4,-1530992060);e=hh(e,a,b,c,d[i+4],11,1272893353);c=hh(c,e,a,b,d[i+7],16,-155497632);b=hh(b,c,e,a,d[i+10],23,-1094730640);
    a=hh(a,b,c,e,d[i+13],4,681279174);e=hh(e,a,b,c,d[i+0],11,-358537222);c=hh(c,e,a,b,d[i+3],16,-722521979);b=hh(b,c,e,a,d[i+6],23,76029189);
    a=hh(a,b,c,e,d[i+9],4,-640364487);e=hh(e,a,b,c,d[i+12],11,-421815835);c=hh(c,e,a,b,d[i+15],16,530742520);b=hh(b,c,e,a,d[i+2],23,-995338651);
    a=ii(a,b,c,e,d[i+0],6,-198630844);e=ii(e,a,b,c,d[i+7],10,1126891415);c=ii(c,e,a,b,d[i+14],15,-1416354905);b=ii(b,c,e,a,d[i+5],21,-57434055);
    a=ii(a,b,c,e,d[i+12],6,1700485571);e=ii(e,a,b,c,d[i+3],10,-1894986606);c=ii(c,e,a,b,d[i+10],15,-1051523);b=ii(b,c,e,a,d[i+1],21,-2054922799);
    a=ii(a,b,c,e,d[i+8],6,1873313359);e=ii(e,a,b,c,d[i+15],10,-30611744);c=ii(c,e,a,b,d[i+6],15,-1560198380);b=ii(b,c,e,a,d[i+13],21,1309151649);
    a=ii(a,b,c,e,d[i+4],6,-145523070);e=ii(e,a,b,c,d[i+11],10,-1120210379);c=ii(c,e,a,b,d[i+2],15,718787259);b=ii(b,c,e,a,d[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);e=safeAdd(e,oe);
  }
  return [a,b,c,e].map(n=>{let h="";for(let i=0;i<4;i++)h+=((n>>(i*8))&0xff).toString(16).padStart(2,"0");return h;}).join("");
}

// ─── Main Handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // Health check — GET "/" returns OK so you can test the Worker URL directly
    if (request.method === "GET") {
      return text("Tri Labs Worker is running ✓");
    }

    if (request.method !== "POST") {
      return text("Method Not Allowed", 405);
    }

    // ── Guard: check required env vars ────────────────────────────────────────
    if (!env.TELEGRAM_TOKEN)   return json({ error: "Missing env: TELEGRAM_TOKEN" }, 500);
    if (!env.TELEGRAM_CHAT_ID) return json({ error: "Missing env: TELEGRAM_CHAT_ID" }, 500);
    if (!env.PUSHER_APP_ID)    return json({ error: "Missing env: PUSHER_APP_ID" }, 500);
    if (!env.PUSHER_KEY)       return json({ error: "Missing env: PUSHER_KEY" }, 500);
    if (!env.PUSHER_SECRET)    return json({ error: "Missing env: PUSHER_SECRET" }, 500);
    if (!env.PUSHER_CLUSTER)   return json({ error: "Missing env: PUSHER_CLUSTER" }, 500);

    // ── Parse body ─────────────────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const msgText  = (body.text   || "").trim();
    const sender   = (body.sender || "user").trim();

    if (!msgText) return json({ error: "Empty message" }, 400);

    // ── Step 1: Send to Telegram ───────────────────────────────────────────────
    try {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id:    env.TELEGRAM_CHAT_ID,
            text:       `💬 [Tri Labs Chat]\nFrom: ${sender}\n\n${msgText}`,
            parse_mode: "HTML",
          }),
        }
      );

      if (!tgRes.ok) {
        const err = await tgRes.text();
        console.error("[Telegram] failed:", tgRes.status, err);
        return json({ error: "Telegram delivery failed", detail: err }, 502);
      }
    } catch (e) {
      console.error("[Telegram] fetch threw:", e.message);
      return json({ error: "Telegram network error", detail: e.message }, 502);
    }

    // ── Step 2: Trigger Pusher (non-fatal — chat still works via Telegram) ────
    try {
      await triggerPusher(env, "chat-room", "new-message", { text: msgText, sender });
    } catch (e) {
      console.error("[Pusher] non-fatal error:", e.message);
      // Don't fail the request — Telegram already got the message
    }

    return json({ ok: true });
  },
};
