var Sequelize = require('sequelize');
var sequelize = require('../db/config.js');
var bcrypt = require('bcrypt');
var Item = require('./items.js');
var Follower = require('./followers.js');
var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  underscored: true,
  classMethods: {
    associate: function(models) {
      User.hasMany(models.User, {through: 'follower'});
    }
  }
});

// Add relationship between users and users as follower and following
User.belongsToMany(User, {as: 'followings', through: Follower, foreignKey: 'followedById'});
User.belongsToMany(User, {as: 'followers', through: Follower, foreignKey: 'followingId'});

module.exports = User;
