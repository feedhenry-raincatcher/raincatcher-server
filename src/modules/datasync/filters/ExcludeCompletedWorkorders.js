"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Excludes WorkOrders with a Complete date over a set number of days ago
 * @param queryParams
 */
function excludeCompleteWorkOrders(days) {
    if (days < 0) {
        throw new Error("Days must be a number greater than or equal to zero, got " + days);
    }
    return function (queryParams) {
        var daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);
        var excludeQuery = {
            '$or': [
                { 'statusHistory.Complete': { '$exists': false } },
                { 'statusHistory.Complete': { '$gt': daysAgo.getTime() } }
            ]
        };
        // Add this query to $and so it doesn't overwrite other queries
        queryParams.$and = queryParams.$and || [];
        queryParams.$and.push(excludeQuery);
    };
}
exports.excludeCompleteWorkOrders = excludeCompleteWorkOrders;
//# sourceMappingURL=ExcludeCompletedWorkorders.js.map