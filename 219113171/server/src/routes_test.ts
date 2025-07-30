import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { list, load, resetPolls, save } from './routes';


describe('routes', function() {

  const options: string[] = [];
  // TODO: remove the tests for the dummy route

  /*it('dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Bob'} });
    const res1 = httpMocks.createResponse();
    dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {msg: "Hi, Bob!"});
  });*/


  it('save', function() {

    options.push("option1");
    options.push("option2");

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 2, minutes: 1, options: options} });
    const res1 = httpMocks.createResponse();options
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "[save] name not string");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: options, minutes: 3, options: options} });
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "[save] name not string");


    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bob", minutes: "Bobber", options: options} });
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "[save] minutes not a number");

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bobber", minutes: "Bob", options: options} });
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "[save] minutes not a number");


    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bob", minutes: 3, options: "options not an array"} });
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "[save] options not an array");

    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bobber", minutes: 2, options: "polls"} });
    const res6 = httpMocks.createResponse();
    save(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "[save] options not an array");


    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bob', minutes: 1, options: options} });
    const res = httpMocks.createResponse();
    save(req, res);

    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), {added: true});

    const req0 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bobbers', minutes: 3, options: options} });
    const res0 = httpMocks.createResponse();
    save(req0, res0);
    assert.strictEqual(res0._getStatusCode(), 200);
    assert.deepStrictEqual(res0._getData(), {added: true});


    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bob", minutes: 3, options: options} });
    const res7 = httpMocks.createResponse();
    save(req7, res7);

    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(), "Poll with that name already exists");

    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: "Bobbers", minutes: 2, options: options} });
    const res8 = httpMocks.createResponse();
    save(req8, res8);

    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(), "Poll with that name already exists");

  });



  it('list', function() {
    
    // open, some polls

    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'open'} });
    const res1 = httpMocks.createResponse();
    list(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().open.length, 2);

    const req0 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bo', minutes: 1, options: options} });
    const res0 = httpMocks.createResponse();
    save(req0, res0);

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'open'} });
    const res2 = httpMocks.createResponse();
    list(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData().open.length, 3);
  
    // open, no polls

    resetPolls();

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'open'} });
    const res3 = httpMocks.createResponse();
    list(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), "[list] No open polls in server");
    
    // closed, no polls

    const req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'closed'} });
    const res4 = httpMocks.createResponse();
    list(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), "[list] No closed polls in server");

    // closed, some polls

    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bo', minutes: -1, options: options} });
    const res10 = httpMocks.createResponse();
    save(req10, res10);
    list(req10, res10);

    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'closed'} });
    const res5 = httpMocks.createResponse();
    list(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().closed.length, 1);

    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bob', minutes: -1, options: options} });
    const res = httpMocks.createResponse();
    save(req, res);
    list(req, res);

    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {type: 'closed'} });
    const res6 = httpMocks.createResponse();
    list(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData().closed.length, 2);

  });


  // have Bob and Bo
  it('load', function() {
    
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 3} });
    const res1 = httpMocks.createResponse();
    load(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "[load] query was not a string");

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: options} });
    const res2 = httpMocks.createResponse();
    load(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "[load] query was not a string");


    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  sdkjfgfk'} });
    const res5 = httpMocks.createResponse();
    load(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "[load] open poll with this name does not exist");

    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  fbdjb'} });
    const res6 = httpMocks.createResponse();
    load(req6, res6);

    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "[load] open poll with this name does not exist");

    
    // closed

    const req100 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bobo', minutes: 0, options: options} });
    const res100 = httpMocks.createResponse();
    save(req100, res100);
    list(req100, res100);

    const req10 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'closedsdkjfgfk'} });
    const res10 = httpMocks.createResponse();
    load(req10, res10);

    assert.strictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(), "[load] closed poll with this name does not exist");

    const req11 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'closedfbdjb'} });
    const res11 = httpMocks.createResponse();
    load(req11, res11);

    assert.strictEqual(res11._getStatusCode(), 400);
    assert.deepStrictEqual(res11._getData(), "[load] closed poll with this name does not exist");

    // existing polls 200

    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bob', minutes: 1, options: options} });
    const res = httpMocks.createResponse();
    save(req, res);
    list(req, res);

    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  Bob'} });
    const res3 = httpMocks.createResponse();
    load(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData().options.length, 2);

    const req13 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'Bo', minutes: 0, options: options} });
    const res13 = httpMocks.createResponse();
    save(req13, res13);
    list(req13, res13);

    const req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  Bo'} });
    const res4 = httpMocks.createResponse();
    load(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().options.length, 2);
  });

  it('updatePolls', function() {
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', 
        body: {name: 'garfield', minutes: -1, options: options} });
    const res = httpMocks.createResponse();
    
    save(req, res);

    assert.strictEqual(res._getStatusCode(), 200)
    assert.deepStrictEqual(res._getData(), {added: true}) // saved

    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  garfield'} });
    const res1 = httpMocks.createResponse();
    
    load(req1, res1) // should be loaded

    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().options.length, 2);

    list(req, res); // updatePolls is called in list; poll is made "closed"

    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/load', query: {name: 'open  garfield'} });
    const res2 = httpMocks.createResponse();

    load(req2, res2); // should NOT be loaded

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "[load] open poll with this name does not exist");
  })

});