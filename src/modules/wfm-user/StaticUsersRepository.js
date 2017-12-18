"use strict";
/**
 * @module @raincatcher/demo-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = require("bluebird");
var _ = require("lodash");
// tslint:disable-next-line:no-var-requires
exports.users = require('./users.json');
/**
 * Implementation for UsersRepository based on static demo data.
 * Note: This implementation is only for demo purposes.
 */
var StaticUsersRepository = /** @class */ (function () {
    function StaticUsersRepository() {
    }
    StaticUsersRepository.prototype.getUser = function (id) {
        var foundUser = _.find(exports.users, function (user) {
            return user.id === id;
        });
        if (!foundUser) {
            return Bluebird.reject("User with id " + id + " not found");
        }
        return Bluebird.resolve(foundUser);
    };
    StaticUsersRepository.prototype.retrieveUsers = function (filter, limit) {
        var filteredList;
        if (!filter) {
            filteredList = [];
        }
        else {
            filteredList = _.filter(exports.users, function (user) {
                return user.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            });
        }
        return Bluebird.resolve(_.take(filteredList, limit));
    };
    return StaticUsersRepository;
}());
exports.StaticUsersRepository = StaticUsersRepository;
//# sourceMappingURL=StaticUsersRepository.js.map