const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // Min 10 rounds bcrypt will be handled before save
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
