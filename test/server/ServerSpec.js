process.env.NODE_ENV = 'test';
var expect = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');
var handler = require('../../server/helper/handler.js');
var helper = require('../../server/helper/helpers.js');
var item = require('../../server/controller/items.js');
var Item = require('../../server/models/items.js');
var user = require('../../server/controller/users.js');
var User = require('../../server/models/users.js');
var app = require('../../server/app.js');
var supertest = require('supertest')(app);

var port = process.env.PORT || 4000;

describe('Server-side Unit test', function () {
  var req, res, spy;
  var expectedError = new Error('oops');
  var expectedObject = {};
  var expectedArray = [{},{}];

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()
    req = res = {};
    req.body = {};
    req.params = {};
    spyOnSend = res.send = this.sandbox.spy(function(){return this;});
    spyOnEnd = res.end = this.sandbox.spy(function(){return this;});
    spyOnStatus = res.status = this.sandbox.spy(function(){return this;});
    spyOnSendStatus = res.sendStatus = this.sandbox.spy(function(){return this;});
    findAllStub = this.sandbox.stub(User, 'findAll');
    findAllStub2 = this.sandbox.stub(Item, 'findAll');
    createStub = this.sandbox.stub(User, 'create');
    createStub2 = this.sandbox.stub(Item, 'create');
    findByIdStub = this.sandbox.stub(User, 'findById');
    findByIdStub2 = this.sandbox.stub(Item, 'findById');
    destroyStub = this.sandbox.stub(User, 'destroy');
    destroyStub2 = this.sandbox.stub(Item, 'destroy');
    updateStub = this.sandbox.stub(User, 'update');
    updateStub2 = this.sandbox.stub(Item, 'update');
  });

  afterEach(function () {
    this.sandbox.restore()
  });

  describe('Helper Method test', function () {
    it('cleanUser should refine user data', function () {
      var expected = {
        email: 'test',
        username: 'test',
        id: 3
      };
      var input = {
        get: function(field) {
          var user = {};
          user.id = 3;
          user.email = 'test';
          user.username = 'test';
          user.password = 'test;'
          return user[field];
        }
      };
      expect(helper.cleanUser(input)).to.deep.equal(expected);
    });
  });

  describe('Controller Test', function () {
    describe.skip('item controller', function () {
      describe('getAll() method', function () {
        it('should be a function that takes 1 argument', function(){
          expect(item.getAll).to.be.a('function');
          expect(item.getAll.length).to.equal(1);
        });
        it('should invoke the callback with items upon success', function(done) {
          findAllStub2.resolves(expectedArray)
          item.getAll(function(err, items) {
            expect(items).to.deep.equal(expectedArray);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke the callback with error upon failure', function(done) {
          findAllStub2.rejects(expectedError)
          item.getAll(function(err, items) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('addOne() method', function () {
        it('should be a function that takes 2 arguments', function(){
          expect(item.addOne).to.be.a('function');
          expect(item.addOne.length).to.equal(2);
        });
        it('should invoke the callback with item upon success', function(done) {
          createStub2.resolves(expectedObject)
          item.addOne({}, function(err, item) {
            expect(item).to.deep.equal(expectedObject);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke the callback with error upon failure', function(done) {
          createStub2.rejects(expectedError)
          item.addOne({}, function(err, item) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('getOne() method', function () {
        it('should be a function that takes 2 arguments', function(){
          expect(item.getOne).to.be.a('function');
          expect(item.getOne.length).to.equal(2);
        });
        it('should invoke the callback with item upon success', function(done) {
          findOneStub2.resolves(expectedObject)
          item.getOne(1, function(err, item) {
            expect(item).to.deep.equal(expectedObject);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke the callback with error upon failure', function(done) {
          findOneStub2.rejects(expectedError)
          item.getOne(1, function(err, item) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('removeOne() method', function () {
        it('should be a function that takes 2 arguments', function(){
          expect(item.removeOne).to.be.a('function');
          expect(item.removeOne.length).to.equal(2);
        });
        it('should invoke the callback with deleted item upon success', function(done) {
          destroyStub2.resolves(1)
          item.removeOne(1, function(err, item) {
            expect(item).to.deep.equal(1);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke the callback with error upon failure', function(done) {
          destroyStub2.rejects(expectedError)
          item.removeOne(1, function(err, item) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      //need to work on this one more
      describe('updateOne() method', function () {
        it('should be a function that takes 3 arguments', function(){
          expect(item.updateOne).to.be.a('function');
          expect(item.updateOne.length).to.equal(3);
        });
        it('should invoke the callback with updated item upon success', function(done) {
          updateStub2.resolves([1, [{key: 'value'}]])
          item.updateOne(1, {}, function(err, item) {
            if (err) {return done(err);}
            expect(item).to.deep.equal({key: 'value'});
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke the callback with error upon failure', function(done) {
          updateStub2.rejects(expectedError)
          item.updateOne(1, {}, function(err, item) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });
    });

    describe('user controller', function () {
      describe('getAll() method', function () {
        it('should be a function that takes 1 argument', function () {
          expect(user.getAll).to.be.a('function');
          expect(user.getAll.length).to.equal(1);
        });
        it('should invoke callback func with users data when succeed', function (done) {
          findAllStub.resolves(expectedArray)
          user.getAll(function (err, data) {
            expect(data).to.deep.equal(expectedArray);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke callback func with error when fail', function (done) {
          findAllStub.rejects(expectedError)
          user.getAll(function (err, data) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('addOne() method', function () {
        it('should be a function that takes 2 arguments', function () {
          expect(user.addOne).to.be.a('function');
          expect(user.addOne.length).to.equal(2);
        });
        it('should invoke callback func with a user data when succeed', function (done) {
          createStub.resolves(expectedObject)
          user.addOne({} ,function (err, data) {
            expect(data).to.deep.equal(expectedObject);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke callback func with error when fail', function (done) {
          createStub.rejects(expectedError)
          user.addOne({}, function (err, data) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('getOne() method', function () {
        it('should be a function that takes 2 arguments', function () {
          expect(user.getOne).to.be.a('function');
          expect(user.getOne.length).to.equal(2);
        });
        it('should invoke callback func with a user data when succeed', function (done) {
          findByIdStub.resolves(expectedObject)
          user.getOne(1, function (err, data) {
            expect(data).to.deep.equal(expectedObject);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke callback func with error when fail', function (done) {
          findByIdStub.rejects(expectedError)
          user.getOne(1, function (err, data) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      })

      describe('removeOne() method', function () {
        it('should be a function that takes 2 arguments', function () {
          expect(user.removeOne).to.be.a('function');
          expect(user.removeOne.length).to.equal(2);
        });
        it('should invoke callback func with a user data when succeed', function (done) {
          destroyStub.resolves(1)
          user.removeOne(1, function (err, data) {
            expect(data).to.deep.equal(1);
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke callback func with error when fail', function (done) {
          destroyStub.rejects(expectedError)
          user.removeOne(1, function (err, data) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });

      describe('updateOne() method', function () {
        it('should be a function that takes 3 arguments', function () {
          expect(user.updateOne).to.be.a('function');
          expect(user.updateOne.length).to.equal(3);
        });
        it('should invoke callback func with a user data when succeed', function (done) {
          updateStub.resolves([1, [{test: 'test'}]])
          user.updateOne(1, {}, function (err, data) {
            if(err) {return done(err);}
            expect(data).to.deep.equal({test: 'test'});
            expect(err).to.equal(null);
            done();
          });
        });
        it('should invoke callback func with error when fail', function (done) {
          updateStub.rejects(expectedError)
          user.updateOne(1, {}, function (err, data) {
            expect(err).to.deep.equal(expectedError);
            done();
          });
        });
      });
    });
  });

  describe('Route handler Test', function () {
    describe('/users Route', function () {
      describe('getAllUsers()', function () {
        it('should call user.getAll() method and send users data back', function () {
          var stub = this.sandbox.stub(user, 'getAll');
          var stub2 = this.sandbox.stub(helper, 'cleanUser');
          stub.callsArgWith(0, null, expectedArray);
          stub2.returns({});

          handler.getAllUsers(req, res);
          expect(spyOnSend.calledWith(expectedArray)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
          expect(stub2.called).to.equal(true);
        });
        it('should send 400 status code when user.getAll() throw error', function () {
          var stub = this.sandbox.stub(user, 'getAll');
          stub.callsArgWith(0, expectedError);

          handler.getAllUsers(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('getOneUser()', function () {
        it('should call user.getOne() method and send user back', function () {
          var stub = this.sandbox.stub(user, 'getOne');
          var stub2 = this.sandbox.stub(helper, 'cleanUser');
          stub.callsArgWith(1, null, expectedObject);
          stub2.returns(expectedObject);

          handler.getOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
          expect(stub2.calledOnce).to.equal(true);
        });
        it('should send 400 status code when user.getOne() throw error', function () {
          var stub = this.sandbox.stub(user, 'getOne');
          stub.callsArgWith(1, expectedError);

          handler.getOneUser(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('addOneUser()', function () {
        it('should call user.addOne() method and send added user back', function () {
          var stub = this.sandbox.stub(user, 'addOne');
          var stub2 = this.sandbox.stub(helper, 'cleanUser');
          stub.callsArgWith(1, null, expectedObject);
          stub2.returns(expectedObject);

          handler.addOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
          expect(stub2.calledOnce).to.equal(true);
        });
        it('should send 400 status code when user.addOne() throw error', function () {
          var stub = this.sandbox.stub(user, 'addOne');
          stub.callsArgWith(1, expectedError);

          handler.addOneUser(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('removeOneUser()', function () {
        it('should call user.removeOne() method and send removed user back', function () {
          var stub = this.sandbox.stub(user, 'removeOne');
          stub.callsArgWith(1, null, expectedObject);

          handler.removeOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send 400 status code when user.removeOne() throw error', function () {
          var stub = this.sandbox.stub(user, 'removeOne');
          stub.callsArgWith(1, expectedError);

          handler.removeOneUser(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('updateOneUser()', function () {
        it('should call user.updateOne() method and send updated user back', function () {
          var stub = this.sandbox.stub(user, 'updateOne');
          var stub2 = this.sandbox.stub(helper, 'cleanUser');
          stub.callsArgWith(2, null, expectedObject);
          stub2.returns(expectedObject);

          handler.updateOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
          expect(stub2.calledOnce).to.equal(true);
        });
        it('should send 400 status code when user.updateOne() throw error', function () {
          var stub = this.sandbox.stub(user, 'updateOne');
          stub.callsArgWith(2, expectedError);

          handler.updateOneUser(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });
    });

    describe.skip('/items Route', function () {
      describe('getAllItems()', function(){
        it('should call items.getAll() method and send items back', function () {
          var stub = this.sandbox.stub(item, 'getAll');
          stub.callArgsWith(0, null, expectedArray);
          stub.returns([]);
          //check this logic
          handler.getAllItems(req, res);
          expect(spyOnSend.calledWith(expectedArray)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send status code of 400 when item.getAll() throws an error', function() {
          var stub = this.sandbox.stub(item, 'getAll');
          stub.callsArgWith(0, expectedError);

          handler.getAllUsers(req,res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('addOneItem()', function(){
        it('should call items.addOne() method and send added item back', function () {
          var stub = this.sandbox.stub(item, 'addOne');
          stub.callArgsWith(0, null, expectedObject);
          stub.returns(expectedObject);

          handler.addOneItem(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send status code of 400 when item.addOne() throws an error', function() {
          var stub = this.sandbox.stub(item, 'addOne');
          stub.callsArgWith(1, expectedError);

          handler.addOneItem(req,res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('removeOneItem()', function(){
        it('should call items.addOne() method and send removed item back', function () {
          var stub = this.sandbox.stub(item, 'removeOne');
          stub.callArgsWith(1, null, expectedObject);

          handler.removeOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send status code of 400 when item.removeOne() throws an error', function() {
          var stub = this.sandbox.stub(item, 'removeOne');
          stub.callsArgWith(1, expectedError);

          handler.removeOneItem(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);

        });
      });

      describe('updateOneItem()', function () {
        it('should call item.updateOne() method and send updated item back', function () {
          var stub = this.sandbox.stub(item, 'updateOne');
          stub.callsArgWith(2, null, expectedObject);

          handler.updateOneItem(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send 400 status code when item.updateOne() throw error', function () {
          var stub = this.sandbox.stub(item, 'updateOne');
          stub.callsArgWith(2, expectedError);

          handler.updateOneItem(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });

      describe('getOneItem()', function () {
        it('should call item.getOne() method and send item back', function () {
          var stub = this.sandbox.stub(user, 'getOne');
          stub.callsArgWith(1, null, expectedObject);

          handler.getOneUser(req, res);
          expect(spyOnSend.calledWith(expectedObject)).to.equal(true);
          expect(stub.calledOnce).to.equal(true);
        });
        it('should send 400 status code when item.getOne() throw error', function () {
          var stub = this.sandbox.stub(item, 'getOne');
          stub.callsArgWith(1, expectedError);

          handler.getOneItem(req, res);
          expect(spyOnSendStatus.calledWith(400)).to.equal(true);
        });
      });
    });
  });
});
