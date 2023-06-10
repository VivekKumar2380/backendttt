const mongoose = require("mongoose")
const connection=mongoose.connect("mongodb+srv://vicky:vicky@cluster0.dsf7wsl.mongodb.net/emicalc?retryWrites=true&w=majority")

module.exports ={connection}