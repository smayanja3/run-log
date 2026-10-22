const mongoose = require('mongoose') 

const runSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    distance: {type: Number, required: true, min: 0.1},
    minutes: {type: Number, required: true,  min: 0},
    seconds: {type: Number, required: true,  min: 0, max: 59, default: 0},
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

// time 47:35


//pace conversion 12:15/min

module.exports = mongoose.model('Run', runSchema)  