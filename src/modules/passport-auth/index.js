"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_passport_1 = require("@raincatcher/auth-passport");
var logger_1 = require("@raincatcher/logger");
var jwt = require("jsonwebtoken");
var _ = require("lodash");
var Config_1 = require("../../util/Config");
// Implementation for fetching and mapping user data
var DemoUserRepository_1 = require("./DemoUserRepository");
var config = Config_1.default.getConfig();
function init(router, sessionOpts) {
    // Initialize user data repository and map current user
    var userRepo = new DemoUserRepository_1.default();
    var userService = new DemoUserRepository_1.SampleUserService();
    var authService = new auth_passport_1.PassportAuth(userRepo, userService);
    if (sessionOpts) {
        authService.init(router, sessionOpts);
        createPortalRoutes(router, authService, userRepo);
    }
    else {
        authService.init(router, sessionOpts, config.security.passportjs.jwtSecret);
        createMobileRoutes(router, userRepo, userService);
    }
    return authService;
}
exports.init = init;
function createPortalRoutes(router, authService, userRepo) {
    logger_1.getLogger().info('Creating Portal Routes');
    router.get('/cookie-login', function (req, res) {
        if (req.session) {
            req.session.returnTo = req.headers.referer;
        }
        return res.render('login', {
            title: config.security.passportjs.portalLoginPage.title
        });
    });
    router.post('/cookie-login', authService.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/loginError'
    }));
    router.get('/loginError', function (req, res) {
        return res.render('login', {
            title: config.security.passportjs.portalLoginPage.title,
            message: config.security.passportjs.portalLoginPage.invalidMessage
        });
    });
    router.get('/user/profile', authService.protect(), function (req, res) {
        if (req.session) {
            res.json(req.session.passport.user);
        }
    });
    router.get('/logout', function (req, res) {
        if (req.session) {
            return req.session.destroy(function (err) {
                if (err) {
                    logger_1.getLogger().error(err);
                    return res.status(500).end();
                }
                return res.status(200).end();
            });
        }
        logger_1.getLogger().warn('No session found on GET /logout, responding with HTTP status 200');
        return res.status(200).end();
    });
}
function createMobileRoutes(router, userRepo, userService) {
    logger_1.getLogger().info('Creating Mobile Routes');
    router.post('/token-login', function (req, res, next) {
        if (req.body && req.body.username && req.body.password) {
            var callback = function (err, user) {
                if (user && userService.validatePassword(user, req.body.password)) {
                    var payload = _.clone(user);
                    delete payload.password;
                    var secret = config.security.passportjs.jwtSecret || auth_passport_1.CONSTANTS.defaultSecret;
                    var token = jwt.sign(payload, secret);
                    return res.status(200).json({ 'token': token, 'profile': user });
                }
                return res.status(401).send();
            };
            userRepo.getUserByLogin(req.body.username, callback);
        }
    });
}
//# sourceMappingURL=index.js.map