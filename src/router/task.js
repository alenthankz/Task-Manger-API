const express = require('express')
const router = express.Router();
const Task =require('../db/models/task')

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task =await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send()
        }
        res.status(200).send(task)
    }
    
    catch(e){
        return res.status(400).send()
    }
})

router.patch('/tasks/:id',async (req,res)=>{
    const updates =Object.keys(req.body)
    allowdedUpdates=['description','completed']
    const validOperation =updates.every((update)=>allowdedUpdates.includes(update))
    if(!validOperation){
        return res.status(400).send({
            error:'invalid updates'
        })
        
    } 
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            send.status(404).send({error :'not found'})
        }
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks/:id',async(req,res)=>{
    const _id =req.params.id
    try{
        const task =await Task.findById(_id)
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

router.get('/tasks',async (req,res)=>{
    try{
        const tasks=await Task.find({})
        res.status(201).send(tasks)
    }catch(e){
        res.status(500).send();
    }
    // Task.find({}).then((tasks)=>{
    //     res.status(201).send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send();
    // })
})

router.post('/tasks',async (req,res)=>{
    const task =new Task(req.body)
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