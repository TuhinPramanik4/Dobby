import express from "express";

const app = express();

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello form server")
})

app.listen(8000,(req,res)=>{
    console.log("server started");
})