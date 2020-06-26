require('./src/db/mongoose')
const Task=require('/db/models/task')

Task.findByIdAndDelete('5ef60e02b2e2e8212c6e0987').then((task)=>{
    console.log(task);
    return Task.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})

 (async  (id)=>{
        await Task.findByIdAndDelete(id)
        return await Task.countDocuments({completed:false})
})('5ef60e11b2e2e8212c6e0988').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})