import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    employeeSize: {
        type: String,
        required: true
    },
    businessLocation: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

businessSchema.index({ userId: 1 });

const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);

export default Business;