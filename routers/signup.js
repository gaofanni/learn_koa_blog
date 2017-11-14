const router = require('koa-router')

router.get('/signup',async(ctx,next)=>{
    ctx.render('signup',{

    })
})

module.exports=router