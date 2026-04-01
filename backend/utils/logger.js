const pino = require("pino");

const isDev = process.env.NODE_ENV !== "production";

// Avoid `transport: { target: "pino-pretty" }` here: it spawns a worker that stacks
// `exit` listeners and triggers MaxListenersExceededWarning with nodemon / reloads.
// For colorized logs in dev: `npm run start:pretty`
const logger = pino({
  level: isDev ? "debug" : "info",
});

module.exports = logger;
