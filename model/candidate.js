const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    party : {
        type: String, 
        required: true, 
    },
    age : {
        type: String,
        required : true,
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'user',
                required: true,
            },
            votedAt: {
                type: Date,
                required : true,
                default: Date.now(),
            }
            
        }
    ],
    voteCount: {
        type: Number, 
        default: 0,
    },
}, { timestamps: true });

const Candidate = mongoose.model('candidate', candidateSchema);
module.exports = Candidate;