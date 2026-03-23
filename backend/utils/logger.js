const pino = require("pino");

const isDev = process.env.NODE_ENV !== "production";
const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname,req.headers,res.headers",
        },
      }
    : undefined,
});

module.exports = logger;
