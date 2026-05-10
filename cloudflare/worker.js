/**
 * Tri Labs — Cloudflare Worker (Hardened, Credentials Hardcoded)
 *
 * Receives POST from website → sends to Telegram → triggers Pusher event.
 *
 * NOTE: For production, move secrets to Environment Variables in Cloudflare dashboard.
 */

// ─── Configuration (hardcoded for immediate use) ──────────────────────────────

const CONFIG = {
  TELEGRAM_TOKEN:   "8508763168:AAGstb9uhspQwrBTUIs3Y2kUAJPDi8d5Os8",
  TELEGRAM_CHAT_ID: "6247777053",
  PUSHER_APP_ID:    "2152808",
  PUSHER_KEY:       "19d32477f5acc14b340e",
  PUSHER_SECRET:    "e667151c811908a103a4",
  PUSHER_CLUSTER:   "ap1",
};

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

async function triggerPusher(channel, eventName, data) {
  const { PUSHER_APP_ID: appId, PUSHER_KEY: key, PUSHER_SECRET: secret, PUSHER_CLUSTER: cluster } = CONFIG;

  const body      = JSON.stringify({ name: eventName, channel, data: JSON.stringify(data) });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyMd5   = await computeMd5(body);

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

// ─── Crypto Helpers ───────────────────────────────────────────────────────────

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeMd5(str) {
  return _md5(new TextEncoder().encode(str));
}

function _md5(input) {
  function safeAdd(x,y){const l=(x&0xffff)+(y&0xffff);return((x>>16)+(y>>16)+(l>>16))<<16|l&0xffff;}
  function rot(n,c){return n<<c|n>>>(32-c);}
  function cmn(q,a,b,x,s,t){return safeAdd(rot(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b);}
  function ff(a,b,c,d,x,s,t){return cmn(b&c|~b&d,a,b,x,s,t);}
  function gg(a,b,c,d,x,s,t){return cmn(b&d|c&~d,a,b,x,s,t);}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|~d),a,b,x,s,t);}

  const l8=input.length,l32=l8>>2;
  const w=new Uint32Array(l32+16);
  for(let i=0;i<l8;i++)w[i>>2]|=input[i]<<(i%4*8);
  w[l8>>2]|=0x80<<(l8%4*8);
  w[l32+(l32%16>13?16-l32%16+14:14-l32%16)]=l8*8;

  let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
  for(let i=0;i<w.length;i+=16){
    const[oa,ob,oc,od]=[a,b,c,d];
    a=ff(a,b,c,d,w[i+0],7,-680876936);d=ff(d,a,b,c,w[i+1],12,-389564586);c=ff(c,d,a,b,w[i+2],17,606105819);b=ff(b,c,d,a,w[i+3],22,-1044525330);
    a=ff(a,b,c,d,w[i+4],7,-176418897);d=ff(d,a,b,c,w[i+5],12,1200080426);c=ff(c,d,a,b,w[i+6],17,-1473231341);b=ff(b,c,d,a,w[i+7],22,-45705983);
    a=ff(a,b,c,d,w[i+8],7,1770035416);d=ff(d,a,b,c,w[i+9],12,-1958414417);c=ff(c,d,a,b,w[i+10],17,-42063);b=ff(b,c,d,a,w[i+11],22,-1990404162);
    a=ff(a,b,c,d,w[i+12],7,1804603682);d=ff(d,a,b,c,w[i+13],12,-40341101);c=ff(c,d,a,b,w[i+14],17,-1502002290);b=ff(b,c,d,a,w[i+15],22,1236535329);
    a=gg(a,b,c,d,w[i+1],5,-165796510);d=gg(d,a,b,c,w[i+6],9,-1069501632);c=gg(c,d,a,b,w[i+11],14,643717713);b=gg(b,c,d,a,w[i+0],20,-373897302);
    a=gg(a,b,c,d,w[i+5],5,-701558691);d=gg(d,a,b,c,w[i+10],9,38016083);c=gg(c,d,a,b,w[i+15],14,-660478335);b=gg(b,c,d,a,w[i+4],20,-405537848);
    a=gg(a,b,c,d,w[i+9],5,568446438);d=gg(d,a,b,c,w[i+14],9,-1019803690);c=gg(c,d,a,b,w[i+3],14,-187363961);b=gg(b,c,d,a,w[i+8],20,1163531501);
    a=gg(a,b,c,d,w[i+13],5,-1444681467);d=gg(d,a,b,c,w[i+2],9,-51403784);c=gg(c,d,a,b,w[i+7],14,1735328473);b=gg(b,c,d,a,w[i+12],20,-1926607734);
    a=hh(a,b,c,d,w[i+5],4,-378558);d=hh(d,a,b,c,w[i+8],11,-2022574463);c=hh(c,d,a,b,w[i+11],16,1839030562);b=hh(b,c,d,a,w[i+14],23,-35309556);
    a=hh(a,b,c,d,w[i+1],4,-1530992060);d=hh(d,a,b,c,w[i+4],11,1272893353);c=hh(c,d,a,b,w[i+7],16,-155497632);b=hh(b,c,d,a,w[i+10],23,-1094730640);
    a=hh(a,b,c,d,w[i+13],4,681279174);d=hh(d,a,b,c,w[i+0],11,-358537222);c=hh(c,d,a,b,w[i+3],16,-722521979);b=hh(b,c,d,a,w[i+6],23,76029189);
    a=hh(a,b,c,d,w[i+9],4,-640364487);d=hh(d,a,b,c,w[i+12],11,-421815835);c=hh(c,d,a,b,w[i+15],16,530742520);b=hh(b,c,d,a,w[i+2],23,-995338651);
    a=ii(a,b,c,d,w[i+0],6,-198630844);d=ii(d,a,b,c,w[i+7],10,1126891415);c=ii(c,d,a,b,w[i+14],15,-1416354905);b=ii(b,c,d,a,w[i+5],21,-57434055);
    a=ii(a,b,c,d,w[i+12],6,1700485571);d=ii(d,a,b,c,w[i+3],10,-1894986606);c=ii(c,d,a,b,w[i+10],15,-1051523);b=ii(b,c,d,a,w[i+1],21,-2054922799);
    a=ii(a,b,c,d,w[i+8],6,1873313359);d=ii(d,a,b,c,w[i+15],10,-30611744);c=ii(c,d,a,b,w[i+6],15,-1560198380);b=ii(b,c,d,a,w[i+13],21,1309151649);
    a=ii(a,b,c,d,w[i+4],6,-145523070);d=ii(d,a,b,c,w[i+11],10,-1120210379);c=ii(c,d,a,b,w[i+2],15,718787259);b=ii(b,c,d,a,w[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }
  return [a,b,c,d].map(n=>{let h="";for(let i=0;i<4;i++)h+=((n>>(i*8))&0xff).toString(16).padStart(2,"0");return h;}).join("");
}

// ─── Main Handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request) {

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

      const msgText = (body.text   || "").trim();
      const sender  = (body.sender || "user").trim();

      if (!msgText) return makeJson({ error: "Empty message" }, 400);

      // Step 1 — Send to Telegram
      const tgRes = await fetch(
        `https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id:    CONFIG.TELEGRAM_CHAT_ID,
            text:       `💬 [Tri Labs Chat]\nFrom: ${sender}\n\n${msgText}`,
            parse_mode: "HTML",
          }),
        }
      );

      if (!tgRes.ok) {
        const detail = await tgRes.text();
        console.error("[Telegram] failed:", tgRes.status, detail);
        return makeJson({ error: "Telegram delivery failed", detail }, 502);
      }

      // Step 2 — Trigger Pusher (non-fatal)
      try {
        await triggerPusher("chat-room", "new-message", { text: msgText, sender });
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
