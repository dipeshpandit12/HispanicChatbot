import mongoose from 'mongoose';

const BusinessStageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const BusinessStage = mongoose.models.BusinessStage || mongoose.model('BusinessStage', BusinessStageSchema);

export default BusinessStage;