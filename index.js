const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const ejs = requre('ejs')
const session = requre('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./config/default')
const router = require('koa-router')
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
app.use(bodyParser())

//配置路由
app.use(require('./routers/signup.js').routes())


//监听端口
app.listen(7000)

console.log('listening on port'+config.port)