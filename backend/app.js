const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmetPkg = require("helmet");
const helmet =
  typeof helmetPkg === "function" ? helmetPkg : helmetPkg?.default;
const hpp = require("hpp");
const httpLogger = require("./middleware/httpLogger");
const logger = require("./utils/logger");
// const mongoSanitize = require("express-mongo-sanitize");

const cors = require("cors");
const corsOrigin = require("./utils/cors");
const app = express();

app.use(
  cors({
    origin: corsOrigin,
  }),
);
logger.info("Server Started");
app.use(httpLogger);
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const bookingRouter = require("./routes/bookingRouter");

// Global middleware
// serving static files

app.use(express.static(path.join(__dirname, "public")));
if (typeof helmet !== "function") {
  throw new Error(
    'helmet must be a function — reinstall: npm install helmet@^8 (check `require("helmet")` returns the middleware)',
  );
}
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
app.use("/api/v1/bookings", bookingRouter);
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
