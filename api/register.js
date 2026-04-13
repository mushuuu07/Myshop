const mongoose = require('mongoose');
require('dotenv').config();

export default async function handler(req, res) {
    // Log for debugging
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({ 
            error: "MongoDB URI is not configured in Vercel Environment Variables" 
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            phone: String,
            createdAt: { type: Date, default: Date.now }
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newUser = await User.create({ name, email, phone });

        res.status(201).json({ 
            success: true, 
            message: "Account created successfully!", 
            user: newUser 
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message 
        });
    }
}