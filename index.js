// x-response-time  ->  logging  ->  response  ->  next()

// x-response-time  <-  logging  <-  response  <-

const koaBody = require("koa-body");
const chat = require("./chat");
const Koa = require("koa");
const app = new Koa();

app.use(koaBody());

// /favicon.ico
app.use(async (ctx, next) => {
  console.log(`ctx.url = ${ctx.url}`);
  if (`${ctx.url}` === "/favicon.ico") {
    return "404";
  }
  if (`${ctx.url}` !== "/chat") {
    return "404";
  }
  await next();
});

// application/json
app.use(async (ctx, next) => {
  console.log("打印顺序: " + "application/json");
  let acceptResult = ctx.request.accepts("application/json");
  if (!acceptResult) {
    console.error("request.accepts(types)  Error");
    ctx.body = "only application/json";
    return false;
  }
  await next();
});

// response
app.use(async function (ctx, next) {
  console.log("ctx.method =");
  console.log(ctx.method);
  let method = ctx.method;
  if (method === "POST") {
    let body = ctx.request.body;
    console.log("body = " + JSON.stringify(ctx.request.body));
    if (!body.problem || body.problem.length < 1) {
      console.log("body.problem Error!");
      ctx.body = "no problem";
      return false;
    }
    ctx.body = await chat(body.problem);
    await next();
  } else {
    return "only post";
  }
});

// error
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

console.log("http://localhost:3000");
app.listen(3000);
