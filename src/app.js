'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@raincatcher/logger");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var express = require("express");
var expressHbs = require("express-handlebars");
var morgan = require("morgan");
var path = require("path");
var favicon = require("serve-favicon");
var modules_1 = require("./modules");
var index_1 = require("./user-routes/index");
var Config_1 = require("./util/Config");
var app = express();
var config = Config_1.default.getConfig();
/**
 * Function for setting CORS configuration. When using Passport as an auth service,
 * the credentials must be set to true.By doing this, the origin cannot be set to
 * '*'. Origin needs to be set to allow all origins for enabling cross-domain requests.
 *
 * @returns CORS configuration
 */
function getCorsConfig() {
    var corsConfig = {};
    if (!config.security.keycloak) {
        var dynamicOrigin = function (origin, callback) {
            callback(null, true);
        };
        corsConfig = {
            origin: dynamicOrigin,
            credentials: true
        };
    }
    return corsConfig;
}
if (config.morganOptions) {
    app.use(morgan(config.morganOptions));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(cors(getCorsConfig()));
// Extra diagnostic endpoint for RHMAP
app.get('/sys/info/ping', function (req, res) { return res.status(200).end('"OK"'); });
app.engine('hbs', expressHbs());
app.set('view engine', 'hbs');
modules_1.setupModules(app);
app.use('/', index_1.default);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
var errHandler;
errHandler = function (err, req, res, next) {
    res.status(err.status || 500);
    logger_1.getLogger().error(err);
    var errorObj = {
        message: err.message,
        originalError: config.logStackTraces ? err.originalError : {}
    };
    if (err.code) {
        errorObj.code = err.code;
    }
    else {
        errorObj.code = 'UnexpectedError';
    }
    res.json(errorObj);
};
app.use(errHandler);
exports.default = app;
//# sourceMappingURL=app.js.map