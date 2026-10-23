const mongoose = require('mongoose')

const runSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    distance: { type: Number, required: true, min: 0.1 },
    hours: {type: Number, min: 1, default: 0},
    minutes: { type: Number, required: true, min: 0 },
    seconds: { type: Number, required: true, min: 0, max: 59, default: 0 },
    route: { type: String, required: true },
    feel: {
        type: String,
        enum: ['strong', 'great', 'balanced', 'okay', 'drained'],
        default: 'balanced'
    },
    rating: { type: Number, min: 1, max: 10 },
    notes: String,
}, { timestamps: true }
)
//virtual = calculate feilds, not saved in the db
//---- date display (10,21/2026)
runSchema.virtual('displayDate').get(function () {
    return this.date.toLocaleDateString('en-US', {timeZone: 'UTC'})
})


//---- date input for the edit page to appear in the calander/ date input
// toISOString()= is a date method that returns a string representing a date
//2026-20-21
runSchema.virtual('inputDate').get(function () {
    return this.date.toISOString().slice(0,10)
}) 


// time 47:35
//virtuals == doc properties that can GET = are usuaful formatting and combinding fields
//SET= usful fr decomposing a single value into mulktiple values to store
runSchema.virtual('displayTime').get(function () {
    const secs = this.seconds < 10 ? `0${this.seconds}` : this.seconds
    // only work if the time is over or = hour
    if(this.hour) {
        const mins = this.minutes < 10 ? `0${this.minutes}` : this.minutes
        return `${this.hours}:${this.minutes}:${this.secs}`
    }
    return `${this.minutes}:${secs}`
})


//pace conversion 12:15/min
runSchema.virtual('pace').get(function() {
    //combined the minutes and value together to work with one value
    // had to add the hours 1 hr = 3600 seconds
    const totalSeconds = ((this.hours || 0) * 3600) + (this.minutes * 60) + this. seconds
    //divie seconds by distance
    const secondsPerMile = totalSeconds / this.distance
    //split the distance by min and seconds so we can display it to the user
    let paceMin = Math.floor(secondsPerMile / 60)
    let paceSec = Math.round(secondsPerMile % 60)
    if(paceSec === 60) {
        paceMin += 1 // 60 sec == 1 minute add to the pace min
        paceSec = 0
    }
//cant add padstart to anumber convert to string
// if the seconds alreaady has '34' nothing gets added but if its just '5' == '05'   // '5'.padstart(2,'0') example
    return `${paceMin}:${String(paceSec).padStart(2,'0')}/mile`
})



module.exports = mongoose.model('Run', runSchema)  