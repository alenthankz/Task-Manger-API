const express = require('express')
const router = express.Router();
const User =require('../db/models/user')

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        res.status(201).send(user);
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



router.get('/users',async (req,res)=>{
    try{
        const users =await User.find({})
        res.status(201).send(users)
    }
    catch(e){
        res.status(500).send();
    }
    // User.find({}).then((users)=>{
    //     res.status(201).send(users)
    // }).catch((e)=>{
    //     res.status(500).send();
    // })
})

router.get('/users/:id',async (req,res)=>{
    const _id =req.params.id
    try{
       const user=await  User.findById(_id)
       if(!user){
                return res.status(404).send()
        }
        res.status(200).send(user)
    }catch(e){
        res.send(e)
    }
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.status(200).send(user)
    // }).catch((e)=>{
    //     res.send(e)
    // })
})


router.patch('/users/:id',async (req,res)=>{
    const updates =Object.keys(req.body)
    allowdedUpdates=['name','age','email','password']
    const validOperation =updates.every((update)=>allowdedUpdates.includes(update))
    if(!validOperation){
        return res.status(400).send({
            error:'invalid updates'
        })
    }
    try{
        const user =await User.findById(req.params.id)
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



router.delete('/users/:id',async (req,res)=>{
    try{
       const user= await User.findByIdAndDelete(req.params.id)
       if (!user){
        return res.status(400).send()
        }
        return res.status(200).send(user)
    }catch(e){
        res.status(400).send()
    }
    
})



module.exports=router