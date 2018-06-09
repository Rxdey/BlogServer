const Router = require('koa-router');
const moment = require('moment');
const router = new Router();
const {
  Target,
  User,
  Article,
  findPage
} = require('../model/model')
router.get('/', async (ctx, next) => {
  let title = 'api'
  await ctx.render('index', {
    title
  })
});

router.get('/home', async (ctx, next) => {
  ctx.body = ctx.request.query;
});

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