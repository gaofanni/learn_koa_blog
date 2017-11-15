const router =require('koa-router')()
const userModel=require('../lib/mysql')
const md5=require('md5')

router.get('/signup',async(ctx,next)=>{
    //渲染模板
    await ctx.render('signup',{
        session:ctx.session
    })
})

router.post('/signup',async(ctx,next)=>{
    var body=ctx.request.body
    console.log(body)
    var user={
        name:body.name,
        pass:body.password,
        repeatpass:body.repeatpass
    }
    //先查询是否存在
    await userModel.findDataByName(user.name)
            .then(result=>{
                console.log(result)
                //存在
                if(result.length){
                    try{
                        throw Error('用户存在')
                    }catch(error){
                        console.log(error)
                    }
                    //接口返回
                    ctx.body={
                        data:1
                    }
                }
                //密码输入验证
                else if(user.pass!==user.repeatpass||user.pass==''){
                    ctx.body={
                        data:2
                    }
                }
                else{
                    ctx.body={
                        data:3
                    }
                    console.log('注册成功')
                    userModel.insertData([body.name,md5(body.password)])
                }
            })
})

module.exports=router