const express =require('express')
const app =express()

require('./db/mongoose')

const userRouter =require('./router/user')
const taskRouter=require('./router/task')

const port =process.env.PORT || 3000;

 app.use(express.json())
 app.use(userRouter)
 app.use(taskRouter)






app.listen(port,()=>{
    console.log('port '+port+ ' lisnening');
})
