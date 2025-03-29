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