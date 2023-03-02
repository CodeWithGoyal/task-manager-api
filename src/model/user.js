const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tasks = require("../model/tasks")

const UserSchema = mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        unique:true,
        trim : true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Errror("provide a valid email")
            }
        }
    },
    password:{
        type : String,
        required:true,
        minlength:6,
        validate(value){
            if(value ==="password")
                throw new Error("Password can't be password")
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error("age can't be negative");
            }
        }
    },
    avatar:{
        type : Buffer
    },
    // it will store the various tokens generated for a user as user might login/signup from various devices
    tokens : [{
        token : {
            type :String,
            required : true
        }
    }]
},{
    timestamps : true
})
UserSchema.virtual("tasks",{
    ref : "tasks",
    localField : "_id",
    foreignField : "owner"
})
// before sending the response express call toJSON method and then JSON.stringify method 
// so in order to hide the password and tokens we can delete like this or we can make a custom method
// to send data by this method we need not to change the response object 
UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;
}
// to add a method to user instance 
UserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()},process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

// to add a method to user collection
UserSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("User is not registered")
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(isMatch == false){
        throw new Error("Incorrect password");
    }
    return user;
}
// middleware before saving to database (converting the plain password to hashed password)
UserSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8);
    }
    next()
})
// middleware to remove the tasks created by user before removing the user
UserSchema.pre('remove',async function(next){
    const user = this;
    await Tasks.deleteMany({owner : user._id});
    next();
})

const User = mongoose.model("users",UserSchema)

module.exports = User