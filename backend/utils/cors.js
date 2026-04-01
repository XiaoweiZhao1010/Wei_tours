function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return null;
  return url.trim().replace(/\/$/, "").toLowerCase();
}

/** FRONTEND_URL may be comma-separated; add localhost ↔ 127.0.0.1 for the same port. */
function buildProductionOrigins() {
  const raw = process.env.FRONTEND_URL;
  const set = new Set();

  if (!raw) {
    set.add("http://127.0.0.1:3000");
    set.add("http://localhost:3000");
    return set;
  }
  for (const part of raw.split(",")) {
    const n = normalizeOrigin(part);
    if (!n) continue;
    set.add(n);
    try {
      const u = new URL(n);
      const port = u.port ? `:${u.port}` : "";
      if (u.hostname === "localhost")
        set.add(`${u.protocol}//127.0.0.1${port}`);
      else if (u.hostname === "127.0.0.1")
        set.add(`${u.protocol}//localhost${port}`);
    } catch {
      /* ignore bad URL */
    }
  }
  return set;
}

function isLocalDevOrigin(origin) {
  if (!origin) return true;
  try {
    const u = new URL(origin);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const productionOrigins = buildProductionOrigins();
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? (origin, callback) => {
        if (!origin) return callback(null, true);
        if (productionOrigins.has(origin.toLowerCase()))
          return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      }
    : (origin, callback) => {
        if (!origin || isLocalDevOrigin(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      };
module.exports = corsOrigin;
