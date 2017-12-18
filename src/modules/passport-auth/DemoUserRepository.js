"use strict";
/**
 * @module @raincatcher/demo-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/**
 * Static user json data
 */
// tslint:disable-next-line:no-var-requires
exports.users = require('./users.json');
/**
 * A sample user implementation
 *
 * Note: This implementation is only for demo purposes.
 */
var SampleUserService = /** @class */ (function () {
    function SampleUserService() {
    }
    SampleUserService.prototype.validatePassword = function (user, password) {
        return user.password === password;
    };
    SampleUserService.prototype.hasResourceRole = function (user, role) {
        if (role) {
            return user.roles.indexOf(role) > -1;
        }
        else {
            return true;
        }
    };
    SampleUserService.prototype.getProfile = function (user) {
        var profileData = _.cloneDeep(user);
        delete profileData.password;
        return profileData;
    };
    return SampleUserService;
}());
exports.SampleUserService = SampleUserService;
/**
 * A sample implementation of a user data repository
 */
var SampleUserRepository = /** @class */ (function () {
    function SampleUserRepository() {
    }
    /**
     * A sample get user using a login id from a data source
     */
    SampleUserRepository.prototype.getUserByLogin = function (loginId, callback) {
        var userFound = _.find(exports.users, function (user) {
            if (user.username === loginId) {
                return user;
            }
        });
        callback(undefined, userFound);
    };
    return SampleUserRepository;
}());
exports.SampleUserRepository = SampleUserRepository;
exports.default = SampleUserRepository;
//# sourceMappingURL=DemoUserRepository.js.map