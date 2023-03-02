const express  = require("express");
const router = express.Router();
const sharp = require("sharp")
const User = require("../model/user")
const auth = require("../auth/auth")
const multer = require("multer")
const {sendWelcomeMail,sendCancellationMail} = require("../emails/accounts")
// creating user in database
router.post("/users",async (req, res)=>{
    
    try{
        const user = new User(req.body);
        await user.save();
        sendWelcomeMail(user.email,user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});

    }catch(e){
        res.status(400).send();
    }
    // user.save().then(()=>{
    //     res.send("User successfully created : " + user);
    // }).catch((error)=>{
    //     res.status(500).send("Unable to create the user " + error);
    // })
})

// route for user login
router.post("/users/login",async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token})
    } catch(e) {
        res.status(400).send();
    }
})

// get profile 
router.get("/users/me", auth,async(req,res,next)=>{
    res.send(req.user); 
    // res.send(req.user);
})

const upload = multer({
    // dest : "avatars",
    limits:{
        fileSize:5000000
    },
    // cb -> callback first parameter is error and second is res
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("please provide jpg/jpeg/png file"))
        }
        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,upload.single("avatar"), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",auth,async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get("/users/:id/avatar",async(req,res)=>{
    try {
        console.log(req.params.id);
        const user = await User.findById(req.params.id);
        // console.log(user);
        if(!user || !user.avatar){
            console.log("not found")
            throw new Error();
        }
        res.set('Content-Type',"image/png");
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send("something is wrong");
    }
})

// logout user
router.get("/users/logout",auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>token.token !== req.token)
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// logout from all devices that is remove all tokens
router.get("/users/logoutAll",auth, async(req,res) =>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// read users from database
// router.get("/users", async (req,res)=>{

//     try{
//         const users = await User.find({});
//         if(!users){
//             return res.status(404).send();
//         }
//         res.send(users)
//     } catch(e){
//         res.status(500).send();
//     }

//     // User.find({}).then((allUsers)=>{
//     //     res.send(allUsers);
//     // }).catch((err)=>{
//     //     res.status(500).send("Unable to find the users : " + err);
//     // })
// })



// get user by user id
// router.get("/users/:id",auth,async (req,res)=>{

//     try{
//         const user = await User.findById(req.params.id);
//         if(!user){
//             res.send(404).send()
//         }
//         res.send(user);

//     }catch(e){
//         res.status(500).send();
//     }

//     // User.findById(req.params.id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send("User doesn't exist with this id");
//     //     }
//     //     res.send(user);
//     // }).catch((err)=>{
//     //     res.send("Unable to find the user : " + err);
//     // })
// })



//updating the user profile
router.patch("/users/me",auth, async(req,res)=>{
    const updateParameters = Object.keys(req.body)
    const allowedParameters = ["name","email","password","age"]
    const isValidParameters = updateParameters.every((param) => allowedParameters.includes(param))

    if(!isValidParameters){
        return res.status(400).send();
    }

    try{
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators: true});
        // const user = await  User.findById(req.params.id);

        // if(!req.user){
        //     return res.status(404).send();
        // }

        updateParameters.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        res.send(req.user);

    } catch(e) {
        res.status(400).send(e);
    }
})

// deleting the user 
router.delete("/users/me",auth, async(req, res) =>{
    try{
        await req.user.remove();
        sendCancellationMail(req.user.email, req.user.name);
        // const user = await User.findByIdAndRemove(req.params.id);
        // if(!user){
        //     return res.status(404).send();
        // }
        res.send(req.user);
    } catch(e){
        res.status(500).send();
    }
})



module.exports = router