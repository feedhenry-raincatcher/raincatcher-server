"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var session = require("express-session");
var Config_1 = require("../../util/Config");
// tslint:disable-next-line:no-var-requires
var Keycloak = require('keycloak-connect');
var SessionOptions_1 = require("../SessionOptions");
var config = Config_1.default.getConfig();
var KeycloakSecurity = /** @class */ (function () {
    function KeycloakSecurity() {
    }
    KeycloakSecurity.prototype.init = function (app, sessionOpts) {
        // Express Session Configuration.
        app.use(session(sessionOpts));
        // Create a session store
        var memoryStore = new session.MemoryStore();
        this.keycloak = new Keycloak({ store: memoryStore }, config.security.keycloak);
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
    securityImpl.init(app, SessionOptions_1.default);
    return securityImpl;
}
exports.init = init;
//# sourceMappingURL=index.js.map