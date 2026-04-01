const crypto = require("crypto");
const pinoHttp = require("pino-http");
const logger = require("../utils/logger"); // no .js needed

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    return req.headers["x-request-id"] || crypto.randomUUID();
  },

  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});

module.exports = httpLogger;
