"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var assert = require("assert");
function baseSuite() {
    describe('Base', function () {
        beforeEach(function () {
            assert.ok('Test');
        });
        describe('#foo()', function () {
            it('foo', function () {
                assert.ok('Test');
            });
        });
    });
}
exports.default = baseSuite;
//# sourceMappingURL=index.js.map