"use strict";
/**
 * @module @raincatcher/demo-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
var session = require("express-session");
var Config_1 = require("../../util/Config");
var RedisSession_1 = require("../session/RedisSession");
// tslint:disable-next-line:no-var-requires
var Keycloak = require('keycloak-connect');
var config = Config_1.default.getConfig();
var KeycloakSecurity = /** @class */ (function () {
    function KeycloakSecurity() {
    }
    KeycloakSecurity.prototype.init = function (app, sessionOpts) {
        // Express Session Configuration.
        app.use(session(sessionOpts));
        this.keycloak = new Keycloak({ store: sessionOpts.store }, config.security.keycloak);
        app.use(this.keycloak.middleware({ logout: '/logout' }));
    };
    KeycloakSecurity.prototype.protect = function (role) {
        return this.keycloak.protect(role);
    };
    return KeycloakSecurity;
}());
exports.KeycloakSecurity = KeycloakSecurity;
function init(app) {
    var securityImpl = new KeycloakSecurity();
    securityImpl.init(app, RedisSession_1.default);
    return securityImpl;
}
exports.init = init;
//# sourceMappingURL=index.js.map