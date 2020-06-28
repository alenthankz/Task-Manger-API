const mongoose =require('mongoose');
//'mongodb://127.0.0.1:27017/task-manager-api'
mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
}).then((result)=>{
    console.log('connected to mongodb')
}).catch((e)=>{
    console.log('cannot connect to mongodb')
})


