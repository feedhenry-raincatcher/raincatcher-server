"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sessionOpts = {
    secret: process.env.SESSION_SECRET || 'raincatcher',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        path: '/'
    }
};
exports.default = sessionOpts;
//# sourceMappingURL=SessionOptions.js.map