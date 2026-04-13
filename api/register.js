const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, phone } = req.body;

            if (!name || !email || !phone) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const newUser = await User.create({ name, email, phone });

            res.status(201).json({ 
                success: true, 
                message: "User registered successfully",
                user: newUser 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}