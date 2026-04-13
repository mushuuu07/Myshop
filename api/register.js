const mongoose = require('mongoose');
require('dotenv').config();

export default async function handler(req, res) {
    console.log("=== REGISTER API CALLED ===");
    console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({ 
            error: "MONGODB_URI is NOT set in Vercel Environment Variables!" 
        });
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

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
            message: "Account created successfully!" 
        });
    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ 
            error: "Server Error", 
            message: error.message 
        });
    }
}