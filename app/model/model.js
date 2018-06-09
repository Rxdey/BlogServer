const Sequelize = require('sequelize');
const sequelize = require("../db/db.js")
const Op = Sequelize.Op;
const moment = require('moment');
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
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  username: Sequelize.STRING,
  passwd: Sequelize.STRING,
  headimg: Sequelize.TEXT,
  createTime: Sequelize.STRING
}, {
  timestamps: false,
  tableName: 'user',
});
const Article = sequelize.define('article', {
  // allowNull defaultValue type autoIncrement primaryKey unique
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  title: Sequelize.STRING,
  image: Sequelize.TEXT,
  createTime: Sequelize.STRING,
  targetId: Sequelize.INTEGER,
  authorId: Sequelize.INTEGER,
  artHtml: Sequelize.TEXT,
  artMarkDown: Sequelize.TEXT,
  isShow: Sequelize.INTEGER,
  isPub: Sequelize.INTEGER
}, {
  timestamps: false,
  tableName: 'article',
});

Target.hasMany(Article, {
  foreignKey: 'id'
})
Article.belongsTo(Target, {
  foreignKey: 'targetId'
});
User.hasMany(Target, {
  foreignKey: 'id'
});
Article.belongsTo(User, {
  foreignKey: 'authorId'
});


const findPage = async ({page = 0, target = 0, search = '', artId = 0,type=0,isPub = 1}={}) => {
    let pageSize = 10;
    let last = page * pageSize;
    let attributes = ['id', 'title', 'image', 'targetId', 'authorId', 'createTime','isPub']
    let where = { isShow: 1}
    if(~~isPub)where['isPub'] = ~~isPub
  
    if (~~target) where['targetId'] = ~~target
    if (Trim(search)) where['title'] = { [Op.like]: '%' + search + '%' } 
    if(~~artId){
      where['id'] = ~~artId;
      if(~~type === 2)attributes.push('artHtml')
      if(~~type === 1)attributes.push('artMarkDown')
    }
    const artList = await Article.findAll({
      attributes: attributes,
      include: [{
        attributes: ['target'],
        model: Target
      }, {
        attributes: ['username','headimg'],
        model: User
      }, ],
      where: where,
      offset: last,
      limit: pageSize,
    })
    return artList
  }
    function Trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  function fromateDate(string){
    return moment(string).format().toString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
  }
    module.exports = {
      Target,
      User,
      Article,
      findPage
    }