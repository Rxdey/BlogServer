const Sequelize = require('sequelize');
const sequelize = require("../db/db.js")
const Op = Sequelize.Op;
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

const Art = sequelize.define('Art', {
  // allowNull defaultValue type autoIncrement primaryKey unique
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  artHtml:Sequelize.STRING,
  markdown:Sequelize.TEXT,
  artId:Sequelize.INTEGER,
}, {
  timestamps: false,
  tableName: 'Art',
});


Target.hasMany(Article,{foreignKey:'id'})
Article.belongsTo(Target,{foreignKey:'targetId'});

User.hasMany(Target,{foreignKey:'id'});
Article.belongsTo(User,{foreignKey:'authorId'});

const findPage = async (page=0,target=0,search='',artId=0) => {
  let pageSize = 10;
  let last = page*pageSize;
  let where = { isShow: 1 }
  if(~~target){
    where['targetId'] = ~~target;
  }
  if(Trim(search)){
    where = {
      isShow: 1,
      title:{
        [Op.like]: '%'+search+'%'
      }
    }
  }
  
  let artList = await Article.findAll({
    attributes: ['id', 'title', 'image', 'targetId', 'authorId', 'createTime'],
    include: [{
      attributes: ['target'],
      model: Target
    }, {
      attributes: ['username'],
      model: User
    }, ],
    where: where,
    offset: last,
    limit: pageSize,
  })
  return artList;
}

function Trim(str)
 { 
  return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
// const getArtList = async () =>{
//   return await sequelize.query('select a.*,b.target,c.username from article a left join target b on a.targetId = b.id left join user c on c.id = a.authorId');
// }

module.exports = {
  Target,
  User,
  Article,
  Art,
  findPage
}