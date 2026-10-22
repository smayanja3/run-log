const mongoose = require('mongoose') 

const runSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    distance: {type: Number, required: true, min: 0.1},
    time: {type: Number, required: true,  min: 1},
    route: {type: String, required: true},
    feel: {
        type: String,
        enum: ['strong','great', 'balanced', 'okay', 'drained'],
        default: 'balanced'
    },
    rating: { type: Number, min: 1, max: 10 },
    notes: String,
}, { timestamp: true}
)

module.exports = mongoose.model('Run', runSchema)  