const Router = require('koa-router');
const router = new Router();
const {
  Target,
  User,
  Article,
  Art,
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

  page<=1&&page?page=0:page;

  let artList = await findPage(page,target,search);
  result.data = artList;
  ctx.body = result;
});
router.post('/getCon', async (ctx, next) => {
  // let result = {
  //   code: '00000',
  //   data: [],
  //   msg: '查询成功'
  // }
  // let id = ctx.request.body.id;
  // let list = await Art.findOne({
  //   attributes:['artHtml'],
  //   include: [{
  //     attributes:['title','image','createTime','isShow'],
  //     model: Article
  //   }],
  //   where:{
  //     id:id
  //   }
  // });
  // result.data = list;
  // ctx.body = result;
});


module.exports = router