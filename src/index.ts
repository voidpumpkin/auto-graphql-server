import Koa from 'koa';
const app = new Koa();

app.use(async (ctx) => {
    ctx.body = 'Hello World';
});

const PORT = 3000;
console.log(`Listening at http://localhost:${PORT}`);
app.listen(PORT);
