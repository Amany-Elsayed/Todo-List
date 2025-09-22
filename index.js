const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const errorHandler = require("./middlewares/errorHandler")
const app = express()
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/todoApp').then(() => console.log("connected to server succefully"))
.catch((err) => console.log(err))

const todoRoutes = require("./routes/todo")
const userRoutes = require("./routes/users")

app.listen(3000, function(req, res){
    console.log('server running on port 3000');
})

app.use(errorHandler)

dotenv.config()

app.use(cors({
    origin: "*"
}))

app.use("/todo", todoRoutes)
app.use("/user", userRoutes)

