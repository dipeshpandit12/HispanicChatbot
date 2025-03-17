import mongoose from 'mongoose';

// Additional Resources Schema
const additionalResourceSchema = new mongoose.Schema({
    title: String,
    link: String,
    type: String,
    description: String
}, { _id: false });

// Problem Schema
const problemSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    icon: {
        type: String,
    },
    colorClasses: String
}, { _id: false });

// Solution Schema
const solutionSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    link: String,
    type: String,
    thumbnail: String,
    colorClasses: String
}, { _id: false });

// Main Schema
const issuesAndResourcesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    issuesList: [{
        problem: problemSchema,
        solution: solutionSchema,
        additionalResources: [additionalResourceSchema]
    }]
});

const IssuesAndResources = mongoose.model('IssuesAndResources', issuesAndResourcesSchema);
export default IssuesAndResources;