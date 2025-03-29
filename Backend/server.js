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

// ✅ Google Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

  const reminderSchema = new mongoose.Schema({
    medicineName: String,
    dosage: String,
    time: String,
    phoneNumber: String
  });

const Reminder = mongoose.model('Reminder', reminderSchema);

// ✅ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// ✅ Fix CORS Issue
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

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken =  process.env.TWILIO_AUTH_TOKEN ;
const twilioClient = twilio(accountSid, authToken);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Routes
app.get('/get-reminders/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user.reminders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});


app.post('/add-reminder', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { medicineName, dosage, time } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.reminders.push({ medicineName, dosage, time });
        await user.save();

        res.status(201).json({ message: "Reminder added successfully!" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save reminder' });
    }
});

app.delete('/delete-reminder/:userId/:reminderId', async (req, res) => {
    try {
        const { userId, reminderId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.reminders = user.reminders.filter(reminder => reminder._id.toString() !== reminderId);
        await user.save();

        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});


app.post("/api/update-phone", async (req, res) => {
    try {
        const { userId, phone } = req.body;

        if (!userId || !phone.match(/^\d{10}$/)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        await User.findByIdAndUpdate(userId, { phone });

        res.json({ message: "Phone number updated successfully!" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
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

// Cron Job to Send SMS 1 Minute Before Reminder Time
cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, "0");
      const currentMinute = now.getMinutes();
  
      // Generate three time slots for checking reminders
      const timesToCheck = [
        `${currentHour}:${(currentMinute + 5).toString().padStart(2, "0")}`, // 5 minutes before
        `${currentHour}:${(currentMinute + 3).toString().padStart(2, "0")}`, // 3 minutes before
        `${currentHour}:${(currentMinute + 1).toString().padStart(2, "0")}`, // 1 minute before
      ];
  
      // Find users with reminders matching the timesToCheck
      const users = await User.find({ "reminders.time": { $in: timesToCheck } });
  
      for (const user of users) {
        if (!user.phone) {
          console.error(`⚠️ User (${user._id}) has no phone number set.`);
          continue;
        }
  
        const remindersToSend = user.reminders.filter((reminder) =>
          timesToCheck.includes(reminder.time)
        );
  
        for (const reminder of remindersToSend) {
          await twilioClient.messages.create({
            body: `Reminder: Take your medicine '${reminder.medicineName}' (${reminder.dosage}).`,
            from: twilioNumber,
            to: `+91${user.phone}`,
          });
  
          console.log(`📩 Reminder sent to ${user.phone}`);
        }
      }
    } catch (error) {
      console.error("❌ Cron Job Error:", error);
    }
  });
  


  
  
// ✅ Google OAuth Setup
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

// ✅ AI Response Route (Ask Gemini)
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


// ✅ Google Auth Routes
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
// ✅ Start Server
app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});
