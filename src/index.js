/**
 * @module @raincatcher/demo-server
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
var logger_1 = require("@raincatcher/logger");
var Config_1 = require("./util/Config");
var config = Config_1.default.getConfig();
logger_1.setLogger(new logger_1.BunyanLogger(config.bunyanConfig));
var http = require("http");
var app_1 = require("./app");
/**
 * Get port from environment and store in Express.
 */
var port = config.port;
app_1.default.set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app_1.default);
/**
 * Listen on provided port,on all network interfaces.
 */
server.listen(port, onListening);
server.on('error', onError);
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    if (error.code === 'EADDRINUSE') {
        logger_1.getLogger().error(error.port + ' port number is already in use');
        return process.exit(1);
    }
    throw error;
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    logger_1.getLogger().info('Listening on ' + addr.port);
}
//# sourceMappingURL=index.js.map