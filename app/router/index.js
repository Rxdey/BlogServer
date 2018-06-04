const Router = require('koa-router');
const router = new Router();
const {
  Target,
  User,
  Article
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
  // let tag = await Target.findAll({where: {isShow: 1}});
  let artList = await Article.findAll()

  result.data = artList;
  ctx.body = result;
});
const findPage = (page) => {
  let pageSize = 10;
  // Article.findAll({
  //   include: [{
  //     model: Target,
  //     as: 'b',
  //     where: {
  //       b: 4
  //     }
  //   }]
  // });
}
module.exports = router