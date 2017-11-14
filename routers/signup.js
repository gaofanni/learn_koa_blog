const router = require('koa-router')()

router.get('/signup',async(ctx,next)=>{
    await ctx.render('signup',{

    })
})

module.exports=router