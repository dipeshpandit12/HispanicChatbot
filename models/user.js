import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'userData' // This specifies the collection name
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;