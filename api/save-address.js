const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    createdAt: { type: Date, default: Date.now }
});

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const address = await Address.create(req.body);
        res.status(201).json({ message: "Address saved successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}