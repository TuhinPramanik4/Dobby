import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import cors from "cors";
import cron from 'node-cron';
import twilio from 'twilio';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));


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