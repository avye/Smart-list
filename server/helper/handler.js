var item = require('../controller/items.js');
var user = require('../controller/users.js');
var helper = require('./helpers.js');
var User = require('../models/users.js');
var _ = require('lodash');
var apis = require('./apis.js');

var category = {
  'READ': 'amazonBook',
  'LISTEN': 'spotify',
  'WATCH': 'amazonMovie',
  'BUY': 'amazonBuy',
  'EAT': 'yelp'
};

module.exports = {
  getAllItems: function (req, res) {
    var id = req.headers.user;
    item.getAll(id, function (err, items) {
      if(err) {return res.sendStatus(400);}
      res.send(items);
    });
  },

  getOneItem: function(req, res) {
    var id = req.params.id;
    item.getOne(id, function(err, item) {
      if(err) {return res.sendStatus(400);}
      res.send(item);
    });
  },

  addOneItem: function(req, res) {
    var newItem = req.body;
    if(newItem.category === 'DO') {
      var refinedItem = newItem;
      refinedItem.content = '';
      item.addOne(refinedItem, function(err, newItem) {
        if(err) {return res.sendStatus(400);}
        res.status(201).send(newItem);
      });
    } else {
      apis[category[newItem.category]](newItem)
      .then(function(refinedItem) {
        console.log("REFINED ITEM!!: ", refinedItem)
        item.addOne(refinedItem, function(err, newItem) {
          if(err) {return res.sendStatus(400);}
          res.status(201).send(newItem);
        });
      })
      .catch(function(err) {
        res.sendStatus(400);
      });
    }
  },

  removeOneItem: function(req, res) {
    var id = req.params.id;
    item.removeOne(id, function(err, rows) {
      if(err) {return res.sendStatus(400);}
      res.sendStatus(200);
    } )
  },

  updateOneItem: function(req, res) {
    var id = req.params.id;
    var newProps = req.body;
    item.updateOne(id, newProps, function(err, item) {
      if(err) {return res.sendStatus(400);}
      res.status(202).send(item);
    })
  },

  getAllUsers: function (req, res) {
    var id = req.headers.user;
    user.getAll(id, function (err, users) {
      console.log('error!!', err);
      if(err) {return res.sendStatus(400);}
      var returnedUsers = users.map(function (user) {
        return helper.cleanUser(user);
      });
      res.send(returnedUsers);
    });
  },

  getOneUser: function (req, res) {
    var id = req.params.id;
    user.getOne(id, function (err, user) {
      if(err) {return res.sendStatus(400);}
      var returnedUser = helper.cleanUser(user);
      res.send(returnedUser);
    });
  },

  addOneUser: function (req, res) {
    var data = req.body;
    user.addOne(data, function (err, user) {
      if(err) {return res.sendStatus(400);}
      var addedUser = helper.cleanUser(user);
      res.send(addedUser);
    });
  },

  signupUser: function (req, res) {
    var data = req.body;
    user.signupOne(data, function (err, userWithJwt) {
      if(err) {return res.sendStatus(400);}
      var addedUser = helper.cleanUser(userWithJwt.addedUser);
      addedUser.jwt = userWithJwt.jwt;
      res.send(addedUser);
    });
  },

  loginUser: function (req, res) {
    var data = req.body;
    user.loginOne(data, function (err, userWithJwt) {
      if(err) {return res.sendStatus(400);}
      var loggedInUser = helper.cleanUser(userWithJwt.loggedInUser);
      loggedInUser.jwt = userWithJwt.jwt;
      res.send(loggedInUser);
    })
  },

  removeOneUser: function (req, res) {
    var id = req.params.id;
    user.removeOne(id, function (err, user) {
      if(err) {return res.sendStatus(400);}
      res.sendStatus(200);
    });
  },

  updateOneUser: function (req, res) {
    var id = req.params.id;
    var updatedData = req.body;
    user.updateOne(id, updatedData, function (err, user) {
      if(err) {return res.sendStatus(400);}
      var updatedUser = helper.cleanUser(user);
      res.send(updatedUser);
    });
  },

  followUser: function (req, res) {
    var id = req.headers.user;
    var following = req.body.id;
    user.follow(id, following, function (err, relation) {
      if(err) {return res.sendStatus(400);}
      res.send(relation);
    })
  },

  unfollowUser: function (req, res) {
    var id = req.headers.user;
    var unfollowing = req.body.id;
    user.unfollow(id, unfollowing, function (err, relation) {
      if(err) {return res.sendStatus(400);}
      res.send(relation);
    })
  },

  shareItem: function(req, res) {
    var itemToBeShared = req.body.item;
    var users = req.body.users;
    delete itemToBeShared.id;
    delete itemToBeShared.created_at;
    delete itemToBeShared.updated_at;
    item.shareItem(itemToBeShared, users, function (err, data) {
      if(err) {return res.sendStatus(400);}
      res.send(data);
    });
  },
}
