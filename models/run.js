const mongoose = require('mongoose') 

const runSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    distance: {type: Number, required: true},
    time: {type: Number, required: true},
    route: {type: String, required: true},
    feel: {
        type: String,
        enum: ['Strong','Great', 'Balanced', 'Okay', 'Drained'],
        default: 'Balanced'
    },
    notes: String,
}, { timestamp: true}
)

module.exports = mongoose.model('Run', runSchema) 