"use strict";
/**
 * @module @raincatcher/demo-server
 */
Object.defineProperty(exports, "__esModule", { value: true });
var datasync_cloud_1 = require("@raincatcher/datasync-cloud");
var logger_1 = require("@raincatcher/logger");
var Promise = require("bluebird");
var Config_1 = require("../../util/Config");
var ExcludeCompletedWorkorders_1 = require("./filters/ExcludeCompletedWorkorders");
var MongoDataHandler_1 = require("./MongoDataHandler");
var sync = datasync_cloud_1.default;
var config = Config_1.default.getConfig();
// Enable sync debug logs
process.env.DEBUG = 'fh-mbaas-api:sync';
// Sync connection options
var connectOptions = {
    datasetConfiguration: {
        mongoDbConnectionUrl: Config_1.default.getConfig().mongodb.url,
        mongoDbOptions: Config_1.default.getConfig().mongodb.options,
        redisConnectionUrl: Config_1.default.getConfig().redis.url
    },
    globalSyncOptions: Config_1.default.getConfig().sync.globalOptions
};
/**
 * Promise wrapper for sync api connect method
 * @return promise
 * @see SyncApi.connect
 */
function connect() {
    return new Promise(function (resolve, reject) {
        sync.connect(connectOptions, function (err, mongo, redis) {
            if (err) {
                logger_1.getLogger().error('Error when trying to connect to mongo and redis', { err: err });
                return reject(err);
            }
            if (!mongo) {
                return reject('Missing mongo client');
            }
            if (config.sync.customDataHandlers) {
                var handler = new MongoDataHandler_1.GlobalMongoDataHandler(mongo);
                var excludeDays = Config_1.default.getConfig().sync.daysToExcludeCompleteWorkorders;
                if (excludeDays > -1) {
                    handler.addListFilterModifier(ExcludeCompletedWorkorders_1.excludeCompleteWorkOrders(excludeDays));
                }
                handler.initGlobalHandlers();
            }
            return resolve({ mongo: mongo, redis: redis });
        });
    });
}
exports.connect = connect;
//# sourceMappingURL=Connector.js.map