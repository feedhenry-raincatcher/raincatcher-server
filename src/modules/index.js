"use strict";
/**
 * @module @raincatcher/demo-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
var datasync_cloud_1 = require("@raincatcher/datasync-cloud");
var filestore_1 = require("@raincatcher/filestore");
var logger_1 = require("@raincatcher/logger");
var wfm_demo_data_1 = require("@raincatcher/wfm-demo-data");
var wfm_rest_api_1 = require("@raincatcher/wfm-rest-api");
var wfm_user_1 = require("@raincatcher/wfm-user");
var express = require("express");
var Config_1 = require("../util/Config");
var Connector_1 = require("./datasync/Connector");
var keycloak_1 = require("./keycloak");
var passport_auth_1 = require("./passport-auth");
var RedisSession_1 = require("./session/RedisSession");
var StaticUsersRepository_1 = require("./wfm-user/StaticUsersRepository");
var config = Config_1.default.getConfig();
/**
 * Setup modules for the mobile and portal app and mount it to
 * the express app.
 */
function setupModules(app) {
    var mobileApp = express.Router();
    exports.mobileSecurityMiddleware = securitySetup(mobileApp);
    var connectionPromise = syncSetup(mobileApp);
    demoDataSetup(connectionPromise);
    fileStoreSetup(mobileApp, exports.mobileSecurityMiddleware);
    var portalApp = express.Router();
    exports.portalsecurityMiddleware = securitySetup(portalApp, RedisSession_1.default);
    wfmApiSetup(portalApp, connectionPromise);
    userApiSetup(portalApp);
    app.use(portalApp);
    app.use(mobileApp);
}
exports.setupModules = setupModules;
function securitySetup(app, sessionOptions) {
    if (config.security.keycloak.realm) {
        return setupKeycloakSecurity(app);
    }
    else {
        return setupPassportSecurity(app, sessionOptions);
    }
}
function userApiSetup(app) {
    var usersRepo = new StaticUsersRepository_1.StaticUsersRepository();
    var userController = new wfm_user_1.UserController(usersRepo);
    var role = config.security.adminRole;
    app.use('/api/users', exports.portalsecurityMiddleware.protect(role), userController.buildRouter());
}
function setupPassportSecurity(app, sessionOptions) {
    return passport_auth_1.init(app, sessionOptions);
}
function setupKeycloakSecurity(app) {
    return keycloak_1.init(app);
}
function syncSetup(app) {
    // Mount api
    var role = config.security.userRole;
    // Mount router at specific location
    var middleware = new datasync_cloud_1.SyncExpressMiddleware('');
    var syncRouter = middleware.createSyncExpressRouter();
    app.use('/sync', exports.mobileSecurityMiddleware.protect(role));
    app.use('/sync', datasync_cloud_1.userMapperMiddleware('workorders', 'assignee', true));
    app.use('/sync', syncRouter);
    return Connector_1.connect().then(function (connections) {
        logger_1.getLogger().info('Sync started');
        return connections.mongo;
    }).catch(function (err) {
        logger_1.getLogger().error('Failed to initialize sync', err);
    });
}
function wfmApiSetup(app, connectionPromise) {
    // Mount api
    var api = new wfm_rest_api_1.WfmRestApi();
    var role = config.security.adminRole;
    app.use('/api', exports.portalsecurityMiddleware.protect(role));
    app.use('/api', api.createWFMRouter());
    if (!connectionPromise) {
        logger_1.getLogger().error('Failed to connect to a database');
    }
    else {
        connectionPromise.then(function (mongo) {
            // Fix compilation problem with different version of Db.
            api.setDb(mongo);
        });
    }
}
function fileStoreSetup(app, securityMiddleware) {
    var fileStore = new filestore_1.GridFsStorage(config.mongodb.url);
    var role = config.security.userRole;
    app.use('/file', securityMiddleware.protect(role), filestore_1.createRouter(fileStore));
}
function demoDataSetup(connectionPromise) {
    if (!connectionPromise) {
        logger_1.getLogger().error('Failed to connect to a database');
    }
    else {
        connectionPromise.then(function (mongo) {
            if (config.seedDemoData) {
                wfm_demo_data_1.default(mongo);
            }
        }).catch(function () {
            logger_1.getLogger().error('Failed to connect to a database');
        });
    }
}
//# sourceMappingURL=index.js.map