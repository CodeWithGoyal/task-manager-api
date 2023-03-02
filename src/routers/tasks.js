const express = require("express")
const router = express.Router();
const Tasks = require("../model/tasks")
const auth = require("../auth/auth")

// creating task in database
router.post("/tasks",auth,async (req,res)=>{
    
    try{
        const task = Tasks({
            ...req.body,
            "owner": req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch(e){

    }

    // const task = Tasks(req.body);
    // task.save().then(()=>{
    //     res.send("Task successfully created : " + task);
    // }).catch((err)=>{
    //     res.status(500).send("Unable to create the task " + err);
    // })
})

// get all tasks
router.get("/tasks",auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc'?-1:1;
        console.log(sort)
    }
    try{
        await req.user.populate({
            path : 'tasks',
            match : match,
            options:{
                limit : parseInt(req.query.limit) || null,
                skip : parseInt(req.query.skip) || null,
                sort : sort
            }
        });
        // if(!req.user.tasks){
        //     return res.status(404).send();
        // }
        res.send(req.user.tasks);

    } catch(e){
        res.status(500).send();
    }
    // Tasks.find({}).then((allTasks)=>{
    //     res.send(allTasks);
    // }).catch((err)=>{
    //     res.status(500).send("Unable to find the tasks : " + err);
    // })
})

// get tasks by id 
router.get("/tasks/:id",auth,async(req,res)=>{

    try{
        const _id = req.params.id;
        const task = await Tasks.findOne({_id, owner : req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);

    } catch(e){
        res.status(500).send();
    }
    // Tasks.findById(req.params.id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send("Task dosen't exist with this id");
    //     }
    //     res.send(task);
    // }).catch((err)=>{
    //     res.status(500).send("Unable to find the tasks : " + err);
    // })
})

// updating the tasks by id
router.patch("/tasks/:id",auth, async(req,res)=>{
    const allowedParameters = ["description","completed"]
    const updateParameters = Object.keys(req.body);
    const isValidParameters = updateParameters.every((update) => allowedParameters.includes(update));
    if(!isValidParameters){
        return res.status(400).send();
    }

    try{
        //const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators: true});
        // const task = await Tasks.findById(req.params.id);
        const task = await Tasks.findOne({_id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send();
        }
        updateParameters.forEach((update) => task[update] = req.body[update])
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
})

// deleting the task by id
router.delete("/tasks/:id",auth, async(req,res)=>{
    try{
        // const task = await Tasks.findByIdAndRemove(req.params.id);
        const task = await Tasks.findOneAndDelete({_id : req.params._id, owner : req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch(e){
        res.status(500).send();
    }
})

module.exports = router