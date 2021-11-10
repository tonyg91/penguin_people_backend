///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// Import dotenv
require("dotenv").config()
// Pull port from .env give it a default of 3000 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// Import express
const express = require("express");
// Application object
const app = express()
//Import mongoose
const mongoose = require("mongoose")
//Import middleware
const cors = require("cors")
// Import morgan
const morgan = require("morgan")

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// Establish Connection 
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODEL
////////////////////////////////

// Create People model
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
  }, {timestamps: true})
  
const People = mongoose.model("People", PeopleSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
// Prevent cors errors, opens up access to frontend
app.use(cors())
// Error logging
app.use(morgan("dev"))
//parse json bodies
app.use(express.json())

///////////////////////////////
// ROUTES
////////////////////////////////

// Home/Test Route
app.get("/", (req, res) => {
    res.send("Hello World!")
})

// Index Route returns people in json
app.get("/people", async (req, res) => {
    // Try Block for catching errors
    try{
        // return people as json
        res.json(await People.find({}))
    }catch(error){
        res.status(400).json({error})
    }
})

// Create Route
app.post("/people", async(req, res) => {
     // Try Block for catching errors
     try{
        // create new person
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json({error})
    }
})

// People update  route
// put request /people/:id, updates person based on id with request body
app.put("/people/:id", async (req, res) => {
    try {
        // update a person
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
          // Send Error
        res.status(400).json({ error });
      }
})

// Delete people Route
app.delete("/people/:id", async (req, res) => {
    try {
        // Delete a person
        res.json(await People.findByIdAndRemove(req.params.id));
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => {console.log(`Listening on PORT ${PORT}`)})