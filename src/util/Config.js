"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
/**
 * Default implementation for configuration.
 * Reads configuration from different location depending on process.env.NODE_ENV
 *
 * Required configuration files in application root:
 * - config-dev.js
 * - config-prod.js
 */
var EnvironmentConfig = /** @class */ (function () {
    function EnvironmentConfig() {
        this.setupProfile();
    }
    EnvironmentConfig.prototype.getConfig = function () {
        return this.rawConfig;
    };
    EnvironmentConfig.prototype.setupProfile = function () {
        var profile = process.env.CONFIG_PROFILE;
        var location = '../../config-' + profile + '.js';
        if (!fs_1.existsSync(path_1.join(__dirname, location))) {
            console.info('Using default server configuration.'
                + 'Set CONFIG_PROFILE env var to point to different configuration file.');
            location = '../../config-dev.js';
        }
        console.info('Loading server side configuration', { path: path_1.basename(location) });
        this.rawConfig = require(location);
    };
    return EnvironmentConfig;
}());
exports.EnvironmentConfig = EnvironmentConfig;
var appConfig = new EnvironmentConfig();
exports.default = appConfig;
//# sourceMappingURL=Config.js.map