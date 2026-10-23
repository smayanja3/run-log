 // set up ======================================================================
 require('dotenv').config()
 const express  = require('express')
 const mongoose = require('mongoose')
 const app      = express()
 let PORT       = process.env.PORT || 5030;
 const Run      = require('./models/run')


 // connect to MongoDb ======================================================================
 const configURL = process.env.MONGODB_URI
 mongoose.connect(configURL)
 mongoose.connection.on('connected', () => {
     console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
 })
 
 mongoose.connection.on('error', (err) => {
     console.log('NOT != MongoDB:', err.message)
 })
 

 // express app ======================================================================
 app.set('view engine', 'ejs')
 app.use(express.static('public'))
 app.use(express.urlencoded({ extended: false }))
 app.use(express.json())


 // GET ======================================================================
//---- all logged runs
 app.get('/runs',(req, res) => {
    //---- sorts them by newset first
    Run.find().sort({date: -1})
    .then(runs => res.render('runs', {runs}))
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
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.redirect('/runs')
    }
    Run.findById(req.params.id)
    .then(run => {
        if(!run) {
            return res.redirect('/runs')
        }
        res.render('oneRun', {run})
    })
    .catch(err => {
        console.log(err.message)
        res.redirect('/runs')
    })
})

//---- edit a run from ONE Run
app.get('/runs/edit/:id', (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.redirect('/runs')
    }
    Run.findById(req.params.id)
    .then(run => { 
        if(!run) {
            return res.redirect('/runs')
        }
        res.render('editRun', {run})
    })
    .catch(err => {
        console.log(err.messsage)
        res.redirect('/run')
    })
})



 // POST =====================================================================
//----- logging new run
 app.post('/runs', (req,res) => {
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
    Run.findByIdAndUpdate(req.params.id, req.body, {runValidators: true})

    .then(() => {
        res.json({message: 'Updated'})
    })
    .catch(err => {
        console.log(err.message)
        res.status(400).json({error: err.message})
    })
})


 // DELETE ===================================================================
app.delete('/runs/:id', (req, res) => {
    console.log('Deleted Run:', req.params.id)
    Run.findByIdAndDelete(req.params.id)
    .then(() => {
        res.json({ message: 'Deleted'})
    })
    .catch(err => {
        res.status(400).json({ error: err.message})
    })
})


//======================================================================
// AUTHENTICATION ======================================================
//======================================================================

 app.listen(PORT, () => {
    console.log(`Server is BURING OIL on PORT ${PORT}`)
})
 