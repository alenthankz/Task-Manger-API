const mongoose =require('mongoose');
const { default: validator } = require('validator');
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken');



userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
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
    },
    tokens:[{
        token:String,
        //required:true
    }]
})
userSchema.methods.generateAuthToken =async function(){
    const user =this
    const token = jwt.sign({_id:user._id.toString()},'toverifytheid')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON =function(){
    const user =this;
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
// userSchema.methods.toJSON = function () {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }
userSchema.statics.findByCredentails= async(email,password)=>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}
userSchema.pre('save',async function(next){
    const user =this
    if(user.isModified('password')){
        user.password =await bcrypt.hash(user.password,8)
    }
    next()
})
const User =mongoose.model('user',userSchema)
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