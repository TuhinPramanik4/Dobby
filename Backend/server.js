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
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));


// ✅ Redirect Routes
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/auth/google/callback", // Fixed callback URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        search_history: []
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
app.get("/api/user", async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authentication is used
        const user = await User.findById(userId).select("-password"); // Excluding password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/ask-gemini", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ error: "Question is required" });
        const prompt1 = `${question} + " recommend only two medicine drug name, nothing more"`;
        const result1 = await model.generateContent(prompt1);
        const response1 = result1.response.text();
        
        const prompt2 = `${question} + " recommend this to do in this situation: resting or going for a walk daily or any other activity, nothing more"`;
        const result2 = await model.generateContent(prompt2);
        const response2 = result2.response.text(); 
        
        res.json({ response1, response2 });
        
    } catch (error) {
        console.error("❌ Error generating response:", error);
        res.status(500).json({ error: "Error fetching AI response" });
    }
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);


app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (user && user.phone) {
                res.redirect("http://localhost:5173/dashboard");
            } else {
                res.redirect("http://localhost:5173/setnumber");
            }
        } catch (error) {
            console.error("Error checking phone number:", error);
            res.redirect("/");
        }
    }
);



app.get("/auth/user", (req, res) => {
    res.send(req.user || null);
});


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