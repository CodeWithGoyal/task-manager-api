const mongoDb = require("mongodb")
const MongoClient = mongoDb.MongoClient

const mongodbUrl = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"
const ObjectID = mongoDb.ObjectID

const id = new ObjectID()
console.log(id);
console.log(id.getTimestamp());

// connect to mongodb
MongoClient.connect(mongodbUrl, function(err, client) {
    if(err) { 
        console.error(err) ;
        return;
    }
    const db = client.db(databaseName);

    // db.collection("users").insertOne({
    //     "name" : "Himanshu",
    //     "age" : 21
    // },(error, result) =>{
    //     if(error){
    //         return console.log("unable to insert document")
    //     }
    //     console.log(result.ops);
    // })

    // db.collection("users").insertMany([
    //     {
    //         name : "xyz",
    //         age : 15
    //     },{
    //         name : "abc",
    //         age : 52
    //     }
    // ],(error,result) =>{
    //     if(error){
    //         console.log("unable to insert")
    //     }
    //     console.log(result.ops);
    // })

    // db.collection("tasks").insertMany([
    //     {
    //         description : "go to gym",
    //         completed : true
    //     },{
    //         description : "take shower",
    //         completed : false
    //     },{
    //         description : "go to class",
    //         completed :  true
    //     }
    // ],(error, result) =>{
    //     if(error){
    //         return console.log("unable to insert document")
    //     }
    //     console.log(result.ops);
    // })

    // db.collection("users").findOne({name : "xyz"}, (error, user)=>{
    //     if(error){
    //         return console.log("error in finding the user in database")
    //     }
    //     console.log(user);
    // })

    // if we pass _id as string it will return null so we have to send it using ObjectID
    // db.collection("users").findOne({_id : new ObjectID("63eb36f3693d3357244912ee")}, (error, user)=>{
    //     if(error){
    //         return console.log("error in finding the user in database")
    //     }
    //     console.log(user);
    // })

    // db.collection("tasks").find({completed : true}).toArray((error, tasks)=>{
    //     if(error){
    //         return console.log("unable to find the tasks")
    //     }
    //     console.log(tasks)
    // })

    // update functions (updateOne, deleteOne,...) passes promise if no callback function is passed in parameters

    // db.collection("users").updateOne({
    //     _id : new ObjectID("63eb36f3693d3357244912ee")
    // },{
    //     // $set is a mongodb update parameter to set the field
    //     $set:{
    //         name : "Mike"
    //     },
    //     // $inc is a mongodb update parameter to inc the value of field
    //     $inc:{
    //         age : 2
    //     }
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((error) =>{
    //     console.log(error);
    // })

    // db.collection("tasks").updateMany({
    //     completed : false
    // }, {
    //     $set:{
    //         completed :  true
    //     }
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((err)=>{
    //     console.log(err);
    // })

    db.collection("users").deleteOne({
        age : 21
    }).then((result)=>
    {
        console.log(result)
    }).catch((err)=>{
        console.log(err);
    })
})



