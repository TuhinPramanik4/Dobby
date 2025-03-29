import express from "express";

const app = express();

app.use(express.json());




// ✅ Redirect Routes
app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/dashboard", (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
});

app.get("/profile", (req, res) => {
    res.redirect("http://localhost:5173/profile");
});

app.listen(8000,(req,res)=>{
    console.log("server started");
})