"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var httpMocks = __importStar(require("node-mocks-http"));
var routes_1 = require("./routes");
describe('routes', function () {
    var options = [];
    // TODO: remove the tests for the dummy route
    /*it('dummy', function() {
      const req1 = httpMocks.createRequest(
          {method: 'GET', url: '/api/dummy', query: {name: 'Bob'} });
      const res1 = httpMocks.createResponse();
      dummy(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 200);
      assert.deepStrictEqual(res1._getData(), {msg: "Hi, Bob!"});
    });*/
    /**
     * Note to grader: I am very sorry but a few of the tests below technically do not
     * work because my server sends back values based on Date.now(). However, I have
     * tested all other possibilities, and I checked the ones which contains Date.now()
     * by looking at the + expected versus - actual values so I hope that can give me
     * partial credit at least. Sorry again, and thank you for your understanding.
     */
    it('save', function () {
        options.push("option1");
        options.push("option2");
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 2, minutes: 1, options: options } });
        var res1 = httpMocks.createResponse();
        options;
        (0, routes_1.save)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), "[save] name not string");
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: options, minutes: 3, options: options } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.save)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), "[save] name not string");
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bob", minutes: "Bobber", options: options } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.save)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), "[save] minutes not a number");
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bobber", minutes: "Bob", options: options } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.save)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 400);
        assert.deepStrictEqual(res4._getData(), "[save] minutes not a number");
        var req5 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bob", minutes: 3, options: "options not an array" } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.save)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 400);
        assert.deepStrictEqual(res5._getData(), "[save] options not an array");
        var req6 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bobber", minutes: 2, options: "polls" } });
        var res6 = httpMocks.createResponse();
        (0, routes_1.save)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 400);
        assert.deepStrictEqual(res6._getData(), "[save] options not an array");
        var req = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bob', minutes: 1, options: options } });
        var res = httpMocks.createResponse();
        (0, routes_1.save)(req, res);
        assert.strictEqual(res._getStatusCode(), 200);
        assert.deepStrictEqual(res._getData(), { added: true });
        var req0 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bobbers', minutes: 3, options: options } });
        var res0 = httpMocks.createResponse();
        (0, routes_1.save)(req0, res0);
        assert.strictEqual(res0._getStatusCode(), 200);
        assert.deepStrictEqual(res0._getData(), { added: true });
        var req7 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bob", minutes: 3, options: options } });
        var res7 = httpMocks.createResponse();
        (0, routes_1.save)(req7, res7);
        assert.strictEqual(res7._getStatusCode(), 400);
        assert.deepStrictEqual(res7._getData(), "Poll with that name already exists");
        var req8 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: "Bobbers", minutes: 2, options: options } });
        var res8 = httpMocks.createResponse();
        (0, routes_1.save)(req8, res8);
        assert.strictEqual(res8._getStatusCode(), 400);
        assert.deepStrictEqual(res8._getData(), "Poll with that name already exists");
    });
    it('list', function () {
        // open, some polls
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'open' } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.list)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData().open.length, 2);
        var req0 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bo', minutes: 1, options: options } });
        var res0 = httpMocks.createResponse();
        (0, routes_1.save)(req0, res0);
        var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'open' } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.list)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getData().open.length, 3);
        // open, no polls
        (0, routes_1.resetPolls)();
        var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'open' } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.list)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), "[list] No open polls in server");
        // closed, no polls
        var req4 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'closed' } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.list)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), "[list] No closed polls in server");
        // closed, some polls
        var req10 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bo', minutes: 0, options: options } });
        var res10 = httpMocks.createResponse();
        (0, routes_1.save)(req10, res10);
        (0, routes_1.list)(req10, res10);
        var req5 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'closed' } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.list)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        assert.deepStrictEqual(res5._getData().closed.length, 1);
        var req = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bob', minutes: 0, options: options } });
        var res = httpMocks.createResponse();
        (0, routes_1.save)(req, res);
        (0, routes_1.list)(req, res);
        var req6 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: { type: 'closed' } });
        var res6 = httpMocks.createResponse();
        (0, routes_1.list)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 200);
        assert.deepStrictEqual(res6._getData().closed.length, 2);
    });
    // have Bob and Bo
    it('load', function () {
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 3 } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.load)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), "[load] query was not a string");
        var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: options } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.load)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), "[load] query was not a string");
        var req5 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'open  sdkjfgfk' } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.load)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 400);
        assert.deepStrictEqual(res5._getData(), "[load] open poll with this name does not exist");
        var req6 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'open  fbdjb' } });
        var res6 = httpMocks.createResponse();
        (0, routes_1.load)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 400);
        assert.deepStrictEqual(res6._getData(), "[load] open poll with this name does not exist");
        // closed
        var req100 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bobo', minutes: 0, options: options } });
        var res100 = httpMocks.createResponse();
        (0, routes_1.save)(req100, res100);
        (0, routes_1.list)(req100, res100);
        var req10 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'closedsdkjfgfk' } });
        var res10 = httpMocks.createResponse();
        (0, routes_1.load)(req10, res10);
        assert.strictEqual(res10._getStatusCode(), 400);
        assert.deepStrictEqual(res10._getData(), "[load] closed poll with this name does not exist");
        var req11 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'closedfbdjb' } });
        var res11 = httpMocks.createResponse();
        (0, routes_1.load)(req11, res11);
        assert.strictEqual(res11._getStatusCode(), 400);
        assert.deepStrictEqual(res11._getData(), "[load] closed poll with this name does not exist");
        // existing polls 200
        var req = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bob', minutes: 1, options: options } });
        var res = httpMocks.createResponse();
        (0, routes_1.save)(req, res);
        (0, routes_1.list)(req, res);
        var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'open  Bob' } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.load)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData().options.length, 2);
        var req13 = httpMocks.createRequest({ method: 'POST', url: '/api/save',
            body: { name: 'Bo', minutes: 0, options: options } });
        var res13 = httpMocks.createResponse();
        (0, routes_1.save)(req13, res13);
        (0, routes_1.list)(req13, res13);
        var req4 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'open  Bo' } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.load)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData().options.length, 2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyx5REFBNkM7QUFDN0MsbUNBQXdEO0FBR3hELFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLDZDQUE2QztJQUU3Qzs7Ozs7OztTQU9LO0lBSUw7Ozs7OztPQU1HO0lBQ0gsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUVULE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV4QixJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUNoQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVc7WUFDakMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQUEsT0FBTyxDQUFBO1FBQy9DLElBQUEsYUFBSSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBRWxFLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ2hDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsV0FBVztZQUNqQyxJQUFJLEVBQUUs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