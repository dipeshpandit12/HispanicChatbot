import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    businessLocation: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Service', 'Manufacturing', 'Technology', 'Food', 'Other']
    },
    platforms: [{
        type: String,
        enum: ['Website', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Other']
    }],
    employeeSize: {
        type: Number,
        required: true,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Business', businessSchema);