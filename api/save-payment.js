const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const paymentSchema = new mongoose.Schema({
    method: String,
    details: Object,
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const payment = await Payment.create(req.body);
            res.status(201).json({ message: "Order placed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}