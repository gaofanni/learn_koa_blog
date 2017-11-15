const router=require('koa-router')()
const userModel=require('../lib/mysql')
const md5=require('md5')

router.get('/signin',async(ctx,next)=>{
    await ctx.render('signin',{
        session:ctx.session
    })
})

router.post('/signin',async(ctx,next)=>{
    let body=ctx.request.body
    console.log(body,'body')
    let name=body.name
    let pass=body.password

    await userModel.findDataByName(name)
            .then(result=>{
                let res=JSON.parse(JSON.stringify(result))
                if(name===res[0]['name']&&md5(pass)===res[0]['pass']){
                    ctx.body='true'
                    ctx.session.user=res[0]['name']
                    ctx.session.id=res[0]['id']
                    console.log('登陆成功')
                }else{
                    ctx.body='false'
                    console.log('用户名或密码错误')
                }
            }).catch(err=>{
                ctx.body='false'
                console.log('用户名或密码错误')
            })
})

module.exports=router