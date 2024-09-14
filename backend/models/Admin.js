const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^((\+92)|(0))3\d{9}$/, "Please enter a valid Pakistani phone number."]
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin'],
        default: 'Admin'
    }
}, { timestamps: true });

// // Hash password before saving
// adminSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 12);
//     }
//     next();
// });

module.exports = mongoose.model('Admin', adminSchema);
