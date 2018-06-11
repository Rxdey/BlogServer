const Router = require('koa-router');
const moment = require('moment');
const router = new Router();
const crypto = require('crypto')
const {
  Target,
  User,
  Article,
  findPage
} = require('../model/model')

router.all('/*', async (ctx, next) => {
  const token = '19ff99b8b15918cd03da3f44e7bcba61';
  let needToken = ['/saveArt','/deleteTarget','/delArt','/addTaget','/addArticle','/pubArt']
  let url = ctx.request.url.toString();
  let isUrl = needToken.indexOf(url);
  if(isUrl !== -1){
    let header = ctx.request.header;
    if(header.token !== token){
      ctx.body = {
        code:"11111",
        msg:'未登录',
        data:null
      };
      return
    }
  }
  await next()
 
});


router.get('/', async (ctx, next) => {
  let title = 'api'
  await ctx.render('index', {
    title
  })
});
router.post('/login', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '登录成功'
  }
  let username = ctx.request.body.username;
  let passwd = ctx.request.body.passwd;
  passwd = md5(passwd)
  let isUser = await User.findOne({
    where:{
      username:username,
      passwd:passwd
    }
  })
  if(!isUser){
    result.code = '99999';
    result.msg = '用户名或密码错误';
  }else{
    result.data = md5(username+passwd+'rxdey');
  }
  ctx.body = result;
  
});
router.get('/home', async (ctx, next) => {
  ctx.body = ctx.request.query;
});
// 获取target
router.post('/getTarget', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '查询成功'
  }
  let tag = await Target.findAll({
    where: {
      isShow: 1
    }
  });
  result.data = tag;
  ctx.body = result;
});
// 获取文章
router.post('/getArticle', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '查询成功'
  }
  let page = ctx.request.body.page;
  let target = ctx.request.body.target;
  let search = ctx.request.body.search;
  let type = ctx.request.body.isPub;

  page <= 1 && page ? page = 0 : page;

  let artList = await findPage({
    page: page,
    target: target,
    search: search,
    isPub: type
  });
  result.data = artList;
  ctx.body = result;
});
// 获取内容
router.post('/getCon', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '查询成功'
  }
  let id = ctx.request.body.id;
  let type = ctx.request.body.type;
  let list = await findPage({
    artId: id,
    type: type,
    isPub: 0
  });
  result.data = list;
  ctx.body = result;
});
// 保存文章
router.post('/saveArt', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '保存成功'
  }
  let id = ctx.request.body.id;
  let title = ctx.request.body.title;
  let artMarkDown = ctx.request.body.artMarkDown;
  let artHtml = ctx.request.body.artHtml;

  let success = await Article.update({
    title: title,
    artMarkDown: artMarkDown,
    artHtml: artHtml
  }, {
    where: {
      id: id,
    }
  })
  result.data = success;
  ctx.body = result
});

router.post('/deleteTarget', async (ctx, next) => {
  let id = ctx.request.body.id;
  let success = await Target.update({
    isShow: 0
  }, {
    where: {
      id: id,
    }
  })
  await Article.update({
    isShow: 0
  }, {
    where: {
      targetId: id,
    }
  })
  ctx.body = success
});
router.post('/delArt', async (ctx, next) => {
  let id = ctx.request.body.id;
  let success = await Article.update({
    isShow: 0
  }, {
    where: {
      id: id,
    }
  })
  ctx.body = success
});

router.post('/addTaget', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '添加成功'
  }
  let name = ctx.request.body.target;
  let artMarkDown = ctx.request.body.artMarkDown;
  let success = await Target.create({
    target: name
  });
  result.data = success;
  ctx.body = result
});

router.post('/addArticle', async (ctx, next) => {
  let result = {
    code: '00000',
    data: [],
    msg: '添加成功'
  }
  let targetId = ctx.request.body.targetId;
  let success = await Article.create({
    targetId: targetId,
    createTime: moment(new Date()).format(),
    authorId: 1
  });
  result.data = success;
  ctx.body = result
});


router.post('/pubArt', async (ctx, next) => {
  let id = ~~ctx.request.body.id;
  let isPub = ~~ctx.request.body.isPub;
  console.log(isPub, id)
  let success = await Article.update({
    isPub: isPub
  }, {
    where: {
      id: id,
    }
  })
  ctx.body = success
});


module.exports = router


/** 
  *@param   str 字符串 
   @param   key 秘钥 
  */  
 function md5(str,key=''){  
  var decipher = crypto.createHash('md5',key)  
  if(key){  
    return decipher.update(str).digest()  
  }  
  return decipher.update(str).digest('hex')  
}  