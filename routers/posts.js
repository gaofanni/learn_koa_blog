const router = require('koa-router')()
const userModel = require('../lib/mysql')
const moment = require('moment')

router.get('/', async(ctx, next) => {
    ctx.redirect('/posts')
})

router.get('/posts', async(ctx, next) => {

    if (ctx.request.querystring) {
        //如果有查询语句，查找某个作者的
    } else {
        //查出所有posts
        await userModel
            .findAllPost()
            .then(result => {
                console.log(result)
                res = JSON.parse(JSON.stringify(result))
                console.log('post', res)
            })
        //查到后，渲染在模板上
        await ctx.render('posts', {
            session: ctx.session,
            posts: res
        })
    }

})
//单独一篇
router.get('/posts/:postId', async(ctx, next) => {
    let {postId} = ctx.params

    await userModel
        .findDataById(postId)
        .then(result => {
            res = JSON.parse(JSON.stringify(result))
            res_pv = parseInt(res[0]['pv'])
            res_pv += 1
        })
    //增加查看数
    await userModel.updatePostPv([res_pv, postId])
    //查询回复
    await userModel
        .findCommentById([postId])
        .then(result => {
            comment_res = JSON.parse(JSON.stringify(result))
        })
    await ctx.render('sPost', {
        session: ctx.session,
        posts: res,
        comments: comment_res
    })
})



router.post('/create', async(ctx, next) => {
    let body = ctx.request.body
    console.log(body)

    let {title, content, id} = body
    let name = body.user
    let time = moment().format('YYYY-MM-DD HH:mm')
    console.log(title, content, id, name, time)

    await userModel
        .insertPost([name, title, content, id, time])
        .then(() => {
            ctx.body = 'true'
        })
        .catch(() => {
            ctx.body = 'false'
        })
})

module.exports = router