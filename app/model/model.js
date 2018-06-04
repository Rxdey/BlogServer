const Sequelize = require('sequelize');
const sequelize = require("../db/db.js")
const Target = sequelize.define('target', {
  // allowNull defaultValue type autoIncrement primaryKey unique
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  target: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: Sequelize.STRING
  },
  isShow: Sequelize.INTEGER
}, {
  timestamps: false,
  tableName: 'target',
});

const User = sequelize.define('user', {
  // allowNull defaultValue type autoIncrement primaryKey unique
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  username:Sequelize.STRING,
  passwd:Sequelize.STRING,
  headimg:Sequelize.TEXT,
  createTime:Sequelize.DATE
}, {
  timestamps: false,
  tableName: 'user',
});
const Article = sequelize.define('article', {
  // allowNull defaultValue type autoIncrement primaryKey unique
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  title:Sequelize.STRING,
  image:Sequelize.TEXT,
  createTime:Sequelize.DATE,
  targetId:Sequelize.INTEGER,
  authorId:Sequelize.INTEGER,
  art:Sequelize.TEXT,
  isShow: Sequelize.INTEGER
}, {
  timestamps: false,
  tableName: 'article',
});

module.exports = {
  Target,
  User,
  Article
}