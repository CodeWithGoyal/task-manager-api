// const proxy = require("node-global-proxy").default;

// proxy.setConfig({
//   http: "http://localhost:1080",
//   https: "https://localhost:1080",
// });
// proxy.start();

const express = require("express");
require("./db/mongoose.js");
const userRoutes = require("./routers/users");
const tasksRoutes = require("./routers/tasks");

const port = process.env.port ;
const app = express();

app.use(express.json()); // to tell express to use json format
app.use(userRoutes);
app.use(tasksRoutes);

// listens for request
app.listen(process.env.PORT,()=>{
    console.log("server is running on port ", process.env.PORT);
})

