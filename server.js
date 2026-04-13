const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Simple User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});
const User = mongoose.model('User', userSchema);

// Address Schema
const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    createdAt: { type: Date, default: Date.now }
});
const Address = mongoose.model('Address', addressSchema);

// Payment Schema (for order)
const paymentSchema = new mongoose.Schema({
    method: String,
    details: Object,
    createdAt: { type: Date, default: Date.now }
});
const Payment = mongoose.model('Payment', paymentSchema);

// Routes
app.get('/api/products', (req, res) => {
    res.json({ message: "Products API working" });
});

app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/save-address', async (req, res) => {
    try {
        const address = new Address(req.body);
        await address.save();
        res.status(201).json({ message: "Address saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/save-payment', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});