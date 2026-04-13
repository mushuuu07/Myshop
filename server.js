const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ====================== Schemas ======================
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

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

const paymentSchema = new mongoose.Schema({
    method: String,
    details: Object,
    createdAt: { type: Date, default: Date.now }
});
const Payment = mongoose.model('Payment', paymentSchema);

// ====================== Routes ======================

// Test route
app.get('/api/products', (req, res) => {
    res.json({ message: 'Products API is working!' });
});

// Register User
app.post('/register', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = new User({ name, email, phone });
        await user.save();

        res.status(201).json({ 
            message: "User registered successfully", 
            user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Save Address
app.post('/save-address', async (req, res) => {
    try {
        const address = new Address(req.body);
        await address.save();
        res.status(201).json({ message: "Address saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Save Payment / Place Order
app.post('/save-payment', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// For Vercel serverless support
module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}