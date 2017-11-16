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
    let {
        postId
    } = ctx.params

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

//评论
router.post('/:postId', async(ctx, next) => {
    let {
        content
    } = ctx.request.body
    let name = ctx.session.user
    let postId = ctx.params.postId

    //插入评论
    await userModel.insertComment([name, content, postId])
        //通过id查找文章，然后更新评论数
    await userModel
        .findDataById(postId)
        .then(result => {
            res_comments = parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
            res_comments++
        })
        //更新评论数
    await userModel
        .updatePostComment([res_comments, postId])
        .then(() => {
            ctx.body = 'true'
        })
        .catch(() => {
            ctx.body = 'false'
        })
})

router.get('/create', async(ctx, next) => {
    await ctx.render('create', {
        session: ctx.session
    })
})

//新增文章
router.post('/create', async(ctx, next) => {
    let body = ctx.request.body
    console.log(body)

    let {
        title,
        content
    } = body
    let id = ctx.session.id
    let name = ctx.session.user
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

//删除文章
router.get('/posts/:postId/remove', async(ctx, next) => {
    let postId = ctx.params.postId

    await userModel.deleteAllPostComment(postId)
    await userModel.deletePost(postId)
        .then(() => {
            ctx.body = {
                data: 1
            }
        }).catch(() => {
            ctx.body = {
                data: 2
            }
        })
})

module.exports = router