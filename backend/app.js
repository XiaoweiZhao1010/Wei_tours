const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const httpLogger = require("./middleware/httpLogger");
const logger = require("./utils/logger");
// const mongoSanitize = require("express-mongo-sanitize");

const cors = require("cors");

function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return null;
  return url.trim().replace(/\/$/, "");
}

/** FRONTEND_URL may be comma-separated; add localhost ↔ 127.0.0.1 for the same port. */
function buildProductionOrigins() {
  const raw = process.env.FRONTEND_URL;
  if (!raw) {
    return ["http://127.0.0.1:3000", "http://localhost:3000"];
  }
  const set = new Set();
  for (const part of raw.split(",")) {
    const n = normalizeOrigin(part);
    if (!n) continue;
    set.add(n);
    try {
      const u = new URL(n);
      const port = u.port ? `:${u.port}` : "";
      if (u.hostname === "localhost") set.add(`${u.protocol}//127.0.0.1${port}`);
      else if (u.hostname === "127.0.0.1") set.add(`${u.protocol}//localhost${port}`);
    } catch {
      /* ignore bad URL */
    }
  }
  return [...set];
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
        if (productionOrigins.includes(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      }
    : (origin, callback) => {
        if (!origin || isLocalDevOrigin(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      };

const app = express();
app.use(httpLogger);
console.log(typeof httpLogger);
logger.info("Server Started");
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");

// Global middleware
// serving static files

app.use(express.static(path.join(__dirname, "public")));
app.use(helmet()); // Set security HTTP headers

// Limit requests from the same IP
const limiter = rateLimit({
  max: 300, // Limit each IP to 100 requests per `window` (
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter); // Apply rate limiting to all API routes
// Body parser, reading data from body into req.body
// This middleware parses incoming request bodies in a middleware before your handlers, available under the 'body' property on the request object
app.use(
  express.json({
    limit: "10kb", // Limit the size of the request body to 10kb
  }),
);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ], // Allow these fields to be passed as query parameters
  }),
); // Prevent parameter pollution

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//mounting the router

// app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
