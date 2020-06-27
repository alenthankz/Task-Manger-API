const mongoose =require('mongoose');

Task =mongoose.model('task',{
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})


module.exports=Task