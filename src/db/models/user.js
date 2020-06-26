const mongoose =require('mongoose');
const { default: validator } = require('validator');


const User =mongoose.model('user',{
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('invalid email');
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ("password cannot contain 'password'")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('age must be valid number');
            }
        }
    }
})
// //when saved to mongodb user small u not captial U 
//  const me =new User({
//      name:'alen thankachan     ',
//      email:'123@gmail.com',
//      age:27
//  })

//  me.save().then(()=>{
//     console.log(me)
//  }).catch((error)=>{
//      console.log(error)
//  })


 module.exports =User