require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Create the Schema
const addressSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
});
// 2. Create the Model (This creates the 'addresses' collection)
const Address = mongoose.model('Address', addressSchema);


// 1. Define the Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});

// 2. Create the Model (This is the "User" that was missing)
const User = mongoose.model('User', userSchema);

// 3. NOW you can use it in the route
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body); 
        await newUser.save();
        res.status(200).send({ message: "Success! User saved to Atlas." });
    } catch (err) {
        res.status(500).send({ message: "Error saving user" });
    }
});

// Ensure this is a clean, standalone block
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        console.log("User saved successfully!"); // This confirms it in your terminal
        res.status(200).send({ message: "Success! User saved to Atlas." });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).send({ message: "Error saving user", error: err.message });
    }
}); // Match these brackets exactly!

// 3. Create the POST route
app.post('/save-address', async (req, res) => {
    try {
        const addressData = new Address(req.body);
        await addressData.save();
        res.status(200).send({ message: "Address saved!" });
    } catch (err) {
        res.status(500).send({ message: "Error saving address" });
    }
});

// Connect to your local MongoDB Compass
// Assuming 'app' is your Express application instance
// e.g., const express = require('express'); const app = express(); app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const userData = req.body; // userData will contain the JSON sent from the client
        // TODO: Implement user registration logic here
        // - Validate userData
        // - Hash password
        // - Save user to database (e.g., MongoDB)

        console.log('Received registration data:', userData);

        // Example response:
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Success: Connected to MongoDb Atlas!"))
.catch(err => console.error("Connection Error:",err));

// 1. Flexible Payment Schema
const paymentSchema = new mongoose.Schema({
    method: String, // 'card', 'upi', or 'cod'
    details: mongoose.Schema.Types.Mixed // Stores different data based on the method
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

// 2. Updated POST route
app.post('/save-payment', async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(200).send({ message: "Order and payment details saved!" });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).send({ message: "Error saving payment" });
    }
});

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));