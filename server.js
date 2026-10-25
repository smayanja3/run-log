// set up ======================================================================
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const app = express()
let PORT = process.env.PORT || 5030;
const Run = require('./models/run')
const User = require('./models/user')


// connect to MongoDb ======================================================================
const configURL = process.env.MONGODB_URI
mongoose.connect(configURL)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
})

mongoose.connection.on('error', (err) => {
    console.log('NOT != MongoDB:', err.message)
})

// configure ======================================================================
require('./config/passport')(passport) // 2()- load the function then call it


// express app ======================================================================
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//---- global conversion so I can use it for my profile page
function formatTime(totalSeconds) {
    const rounded = Math.round(totalSeconds)
    const hours = Math.floor(rounded / 3600)
    const minutes = Math.floor((rounded % 3600) / 60)
    const seconds = rounded % 60
    const ss = String(seconds).padStart(2, '0')
    if (hours > 0) {
        const mm = String(minutes).padStart(2, '0')
        return `${hours}:${minutes}:${ss}`
    }
    return `${minutes}:${ss}`
}



// GET ======================================================================
//---- all logged runs
app.get('/runs', (req, res) => {
    //---- sorts them by newset first
    Run.find().sort({ date: -1 })
        .then(runs => res.render('runs', { runs }))
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Something went wrong')
        })
})

//---- empty form
app.get('/runs/new', (req, res) => {
    res.render('addRun')
})

//----- oneRun
app.get('/runs/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.redirect('/runs')
    }
    Run.findById(req.params.id)
        .then(run => {
            if (!run) {
                return res.redirect('/runs')
            }
            res.render('oneRun', { run })
        })
        .catch(err => {
            console.log(err.message)
            res.redirect('/runs')
        })
})

//---- edit a run from ONE Run
app.get('/runs/edit/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.redirect('/runs')
    }
    Run.findById(req.params.id)
        .then(run => {
            if (!run) {
                return res.redirect('/runs')
            }
            res.render('editRun', { run })
        })
        .catch(err => {
            console.log(err.messsage)
            res.redirect('/run')
        })
})

//------- profile= state page
app.get('/profile', (req, res) => {
    Run.find().sort({ date: -1 })
        .then(runs => {
            // starts at zero == no runs added yet  'default'

            let totalMiles = 0
            let totalSeconds = 0
            let longest = 0
            let fastest = null
            const feels = { strong: 0, great: 0, balanced: 0, okay: 0, drained: 0 }

            // now we can add our runs == similar to run page 
            runs.forEach(run => {
                totalMiles += run.distance
                totalSeconds += run.totalSeconds

                //if my longest run is greater then my total distance show that as my run distance
                if (run.distance > longest) {
                    longest = run.distance
                }

                //this runs pace is faster so it the (current best)
                const pace = run.totalSeconds / run.distance
                if (fastest === null || pace < fastest) {
                    fastest = pace
                }
                //adding nad updating the feel tracker
                if (feels[run.feel] !== undefined) {
                    feels[run.feel] += 1
                }

            })

            //turns the number into a text so i can add them to the page cleanly
            //toFixed rounds a decimal to a set number and returns a string
            // 18.87 to fixed(1) == '18.9'
            // 18.87 tofixed(2) == '18.87'
            const stats = {
                totalRuns: runs.length,
                totalMiles: totalMiles.toFixed(1),
                totalTime: formatTime(totalSeconds),
                avgPace: runs.length > 0 ? formatTime(totalSeconds / totalMiles) : '-',
                fastestPace: fastest !== null ? formatTime(fastest) : '-',
                longest: longest.toFixed(2),
            }
            res.render('profile', { runs, stats, feels, longest })
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('something went wrong loading your stats')
        })
})


// POST =====================================================================
//----- logging new run
app.post('/runs', (req, res) => {
    console.log(req.body)
    Run.create(req.body)
        .then(() => {
            res.redirect('/runs')
        })
        .catch(err => {
            console.log(err.message)
            res.redirect('/runs/new')
        })
})

// PUT ======================================================================

//--- edited Run
app.put('/runs/:id', (req, res) => {
    console.log('Put to body:', req.body)
    Run.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })

        .then(() => {
            res.json({ message: 'Updated' })
        })
        .catch(err => {
            console.log(err.message)
            res.status(400).json({ error: err.message })
        })
})


// DELETE ===================================================================
app.delete('/runs/:id', (req, res) => {
    console.log('Deleted Run:', req.params.id)
    Run.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({ message: 'Deleted' })
        })
        .catch(err => {
            res.status(400).json({ error: err.message })
        })
})


//======================================================================
// AUTHENTICATION ======================================================
//======================================================================

//------ signup form
app.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('signupMessage') })
})

//process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}))

//------- login form
//blank form
app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') })
})

//process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}))

//------- logout
app.get('/login', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/login')
    })
})

//-------- profile (only for logged in users)
app.get('profile', isLoggedIn, (req, res) => {
    Run.find({ owner: req.user._id })
        .then(exercise => {
            res.render('profile', { user: req.user, exercise })
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send('Something went wrong loading your profile')
        })
})

//------- LOGGEDIN
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


//----- logout
app.get('/logout', (req,res) => {
    req.logout((err) => {
        if(err) return next(err)
            res.redirect('/login')
    })
})

app.listen(PORT, () => {
    console.log(`Server is BURNING OIL on PORT ${PORT}`)
})
