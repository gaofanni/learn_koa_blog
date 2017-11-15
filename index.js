const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const ejs = require('ejs')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./config/default')
// const router = require('koa-router')
const views=require('koa-views')
const koaStatic = require('koa-static')
const app = new Koa()

//session存储配置
const sessionMysqlConfig = {
    user:config.database.USERNAME,
    password:config.database.PASSWORD,
    database:config.database.DATABASE,
    host:config.database.HOST
}

//配置session中间件
app.use(session({
    key:'USER_SID',
    store:new MysqlStore(sessionMysqlConfig)
}))

//配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname,'./public')
))

//配置服务端模板渲染引擎中间件
app.use(views(
    path.join(__dirname,'./views'),{
        extension:'ejs'
    }
))

//表单解析中间件
//解析提交的数据，使得ctx.request.body可以得到数据
app.use(bodyParser())

//配置路由
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/signin.js').routes())
app.use(require('./routers/posts.js').routes())
app.use(require('./routers/signout.js').routes())


//监听端口
app.listen(config.port)

console.log('listening on port'+config.port)