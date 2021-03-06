const express = require('express')
const router = express.Router();
const auth =require('../middleware/auth')
const Task =require('../models/task')

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task =await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
        if(!task){
            return res.status(400).send()
        }
        res.status(200).send(task)
    }
    
    catch(e){
        return res.status(400).send()
    }
})

router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates =Object.keys(req.body)
    allowdedUpdates=['description','completed']
    const validOperation =updates.every((update)=>allowdedUpdates.includes(update))
    if(!validOperation){
        return res.status(400).send({
            error:'invalid updates'
        })
        
    } 
    try{
        const task =await Task.findOne({_id:req.params.id,owner:req.user.id})
        updates.forEach((update)=>{
           return task[update]=req.body[update]
        })
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            send.status(404).send({error :'not found'})
        }
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id =req.params.id
    try{
        //const task =await Task.findById(_id)
        const task =await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.send(e)
    }
//     Task.findById(_id).then((task)=>{
//         if(!task){
//             return res.status(404).send()
//         }
//         res.status(200).send(task)
//     }).catch((e)=>{
//         res.send(e)
//     })
})

router.get('/tasks',auth,async (req,res)=>{
    try{
        const match={}
        if(req.query.completed){
              match.completed =req.query.completed==='true'
        }
        const sort={}
        if(req.query.sortBy){
            parts=req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]==='desc'?-1:1;
        }
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
        
        
        // const findObj={
        //     owner:req.user._id
        // }
        // if(req.query.completed){
        //      const match =req.query.completed==='true'
        //      findObj.completed=match
        // }
        // const tasks=await Task.find(findObj)
        // res.status(201).send(tasks)

    }catch(e){
        res.status(500).send(e);
    }
    // Task.find({}).then((tasks)=>{
    //     res.status(201).send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send();
    // })
})

router.post('/tasks',auth,async (req,res)=>{

    const task =new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
                res.status(400).send(e)
    }
//     const task =new Task(req.body)
//     task.save().then(()=>{
//         res.status(201).send(task);
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
})

module.exports=router
