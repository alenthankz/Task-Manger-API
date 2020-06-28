const express =require('express')
const app =express()

require('./db/mongoose')

const userRouter =require('./router/user')
const taskRouter=require('./router/task')

const port =process.env.PORT || 3000;

 app.use(express.json())
 app.use(userRouter)
 app.use(taskRouter)

// const Task =require('./models/task')
// // const User =require('./models/user')

// const main = async ()=>{
//     const task = await Task.findById('5ef863180afb6041ec4af83b')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     // const user =await User.findById('5ef85a8ae49abc2c043ccd2f')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

//  main()


app.listen(port,()=>{
    console.log('port lisnening');
})