import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    employeeSize: {
        type: String,
        required: true,
        enum: ['0-10', '11-50', '51-100', '101-1000', '1000+']
    },
    businessLocation: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true,
        enum: [
            'agriculture',
            'mining',
            'utilities',
            'construction',
            'manufacturing',
            'wholesale',
            'retail',
            'transportation',
            'information',
            'finance',
            'realestate',
            'professional',
            'management',
            'administrative',
            'educational',
            'healthcare',
            'arts',
            'accommodation',
            'other',
            'public'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Business = mongoose.model('Business', businessSchema);

export default Business;