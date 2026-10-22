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


 // POST =====================================================================


 // PUT ======================================================================


 // DELETE ===================================================================


 app.listen(PORT, () => {
    console.log(`Server is BURING OIL on PORT ${PORT}`)
})
