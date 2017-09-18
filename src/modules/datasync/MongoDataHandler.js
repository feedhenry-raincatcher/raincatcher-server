"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datasync_cloud_1 = require("@raincatcher/datasync-cloud");
/**
 * Initializes global mongodb data handlers for feedhenry sync
 * This class override default data handlers in sync to provide more flexible way of handling data.
 * @see https://github.com/feedhenry/fh-sync/blob/master/lib/default-dataHandlers.js
 *
 * In this datahandler we migrating from ObjectId identifiers to client generated ids.
 */
var GlobalMongoDataHandler = /** @class */ (function () {
    /**
     * @param db MongoDb connection
     */
    function GlobalMongoDataHandler(db) {
        this.db = db;
    }
    /**
     * Init all setupHandlers for CRUD operations
     */
    GlobalMongoDataHandler.prototype.initGlobalHandlers = function () {
        this.setupHandleList();
        this.setupHandleCreate();
        this.setupHandleUpdate();
        this.setupHandleRead();
        this.setupHandleDelete();
    };
    GlobalMongoDataHandler.prototype.setupHandleList = function () {
        var self = this;
        datasync_cloud_1.sync.globalHandleList(function (datasetId, queryParams, metadata, cb) {
            queryParams = queryParams || {};
            var resultPromise = self.db.collection(datasetId).find(queryParams);
            return resultPromise.toArray().then(function (list) {
                return cb(undefined, self.toObject(list));
            }).catch(cb);
        });
    };
    GlobalMongoDataHandler.prototype.setupHandleCreate = function () {
        var self = this;
        datasync_cloud_1.sync.globalHandleCreate(function (datasetId, data, metadata, cb) {
            self.db.collection(datasetId).insertOne(data).then(function (res) {
                return cb(undefined, self.makeResponse(res.ops[0]));
            }).catch(cb);
        });
    };
    GlobalMongoDataHandler.prototype.setupHandleUpdate = function () {
        var self = this;
        datasync_cloud_1.sync.globalHandleUpdate(function (datasetId, uid, data, metadata, cb) {
            var query;
            if (data.id) {
                query = { id: data.id };
            }
            else {
                return cb(new Error('Expected the object to have an id field'));
            }
            return self.db.collection(datasetId).updateOne(query, data).then(function () {
                return cb(undefined, data);
            }).catch(cb);
        });
    };
    GlobalMongoDataHandler.prototype.setupHandleRead = function () {
        var self = this;
        datasync_cloud_1.sync.globalHandleRead(function (datasetId, uid, metadata, cb) {
            self.db.collection(datasetId).findOne({ 'id': uid })
                .then(function (result) {
                if (!result) {
                    return cb(new Error('Missing result'));
                }
                delete result._id;
                return cb(undefined, result);
            }).catch(cb);
        });
    };
    GlobalMongoDataHandler.prototype.setupHandleDelete = function () {
        var self = this;
        datasync_cloud_1.sync.globalHandleDelete(function (datasetId, uid, metadata, cb) {
            self.db.collection(datasetId).deleteOne({ 'id': uid }).then(function (object) {
                return cb(undefined, object);
            }).catch(cb);
        });
    };
    /**
     * Formats results to format expected by sync
     * @param array
     */
    GlobalMongoDataHandler.prototype.toObject = function (array) {
        var data = {};
        array.forEach(function (value) {
            var uid = value.id;
            delete value._id;
            data[uid] = value;
        });
        return data;
    };
    /**
     * Enforces specific type of response for sync
     */
    GlobalMongoDataHandler.prototype.makeResponse = function (res) {
        var data = {
            uid: res.id,
            data: res
        };
        delete res._id;
        return data;
    };
    return GlobalMongoDataHandler;
}());
exports.GlobalMongoDataHandler = GlobalMongoDataHandler;
//# sourceMappingURL=MongoDataHandler.js.map