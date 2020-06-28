const express = require('express')
const multer =require('multer')
const router = express.Router();
const sharp =require('sharp')
const User =require('../models/user')
const auth =require('../middleware/auth')

// router.post('/users/signup',async (req,res)=>{
//     const user =new User(req.body)
//     try{
//         await user.save()  
//         res.status(200).send(user)
//     }catch(e){
//          res.status(400).send(e)   
//     }
// })

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentails(req.body.email,req.body.password)
        const token =await user.generateAuthToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users',async (req,res)=>{
    
    const user=new User(req.body)
    try{
        await user.save()
        const token =await user.generateAuthToken()
        res.status(201).send({user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
    // user.save().then(()=>{
    //     res.status(201).send(user);
    // }).catch((error)=>{
    //     res.status(400).send(error);
        
    // })
    
    
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens =req.user.tokens.filter((token)=>{
            return !token==req.token
        })
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()

    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(400).send()
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
    // try{
    //     const users =await User.find({})
    //     res.status(201).send(users)
    // }
    // catch(e){
    //     res.status(500).send();
    // }
    // User.find({}).then((users)=>{
    //     res.status(201).send(users)
    // }).catch((e)=>{
    //     res.status(500).send();
    // })
})

// router.get('/users/:id',async (req,res)=>{
//     const _id =req.params.id
//     try{
//        const user=await  User.findById(_id)
//        if(!user){
//                 return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.send(e)
//     }
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.status(200).send(user)
//     // }).catch((e)=>{
//     //     res.send(e)
//     // })
// })
router.patch('/users/me',auth,async (req,res)=>{
    const updates =Object.keys(req.body)
    allowdedUpdates=['name','age','email','password']
    const validOperation =updates.every((update)=>allowdedUpdates.includes(update))
    if(!validOperation){
        return res.status(400).send({
            error:'invalid updates'
        })
    }
    try{
        const user =req.user
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            send.status(404).send()
        }
        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


// router.patch('/users/:id',async (req,res)=>{
//     const updates =Object.keys(req.body)
//     allowdedUpdates=['name','age','email','password']
//     const validOperation =updates.every((update)=>allowdedUpdates.includes(update))
//     if(!validOperation){
//         return res.status(400).send({
//             error:'invalid updates'
//         })
//     }
//     try{
//         const user =await User.findById(req.params.id)
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })
//         await user.save()
//         //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!user){
//             send.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })



// router.delete('/users/:id',auth,async (req,res)=>{
//     try{
//        const user= await User.findByIdAndDelete(req.params.id)
//        if (!user){
//         return res.status(400).send()
//         }
//         return res.status(200).send(user)
//     }catch(e){
//         res.status(400).send()
//     }
    
// })

router.delete('/users/me',auth,async (req,res)=>{
    try{
    //    const user= await User.findByIdAndDelete(req.user._id)
    //    if (!user){
    //     return res.status(400).send()
    //     }
        await req.user.remove()
        return res.status(200).send(req.user)
    }catch(e){
        res.status(500).send()
    }
    
})

const upload =multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('upload a image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer =await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    //req.user.avatar=req.file.buffer
    await req.user.save()
    
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar =undefined
    await req.user.save()
    
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('content-type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(400).send(e)
    }
})

module.exports=router