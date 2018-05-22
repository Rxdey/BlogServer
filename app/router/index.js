const Router = require('koa-router');
const router = new Router();
router.get('/', async (ctx, next) => {
  let title = 'api'
  await ctx.render('index', {
    title
  })
});
router.get('/home', async (ctx, next) => {
  ctx.body = ctx.request.query;
});
// router.post('/home', async (ctx, next) =>{
//   console.log(ctx.request)
//   ctx.body = ctx.request.body;
// });

module.exports = router