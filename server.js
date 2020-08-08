require('isomorphic-fetch');
const dotenv = require('dotenv');
const Koa = require('koa');
const Router = require('@koa/router');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const koaBody = require('koa-body');
const csvParser = require('csv-parser');
const fs = require('fs');
const Products = require('./models/products');

dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory'],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        ctx.redirect('/');
      },
    }),
  );

  router.post('/csv', koaBody({ multipart: true, formLimit: 400000 }), async (ctx, next) => {
    const results = [];
    ctx.body = ctx.request.files.csv.path;
    fs.createReadStream(ctx.body)
      .pipe(csvParser())
      .on('data', (data) => {
        if (data.Stock !== '') {
          results.push(data) 
        }
      })
      .on('end', () => {
        Products.insertProducts(results);
        ctx.res.statusCode = 200;
      })
      .on('error', (error) => console.log(error))
  });

  server.use(router.routes());
  server.use(router.allowedMethods());
  
  server.use(graphQLProxy({version: ApiVersion.July20}))
  server.use(verifyRequest());
  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return await next();
  });



  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
