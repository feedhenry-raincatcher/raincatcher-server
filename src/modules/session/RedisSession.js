"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectRedis = require("connect-redis");
var session = require("express-session");
var Config_1 = require("../../util/Config");
var config = Config_1.default.getConfig();
var RedisStore = connectRedis(session);
config.security.session.store = new RedisStore(config.security.redisStore);
exports.default = config.security.session;
//# sourceMappingURL=RedisSession.js.map