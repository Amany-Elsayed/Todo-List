const {todoModel} = require("../model/todo")
const {auth} = require("../middlewares/auth")
const APIErrors = require("../errors/APIerrors")

let showTodo = async (req, res, next) => {
    try {
        let show = await todoModel.find().populate("userId")
        res.json(show)
    } catch (err) {
        // res.status(400).json({message: err.message})
        next(err)
    }
}

let createTodo = async (req, res, next) => {
    try {
        let newTodo = req.body
        newTodo.id = decoded.id
        let theNewtodo = await todoModel.create(newTodo)
        res.status(201).json(theNewtodo);
    } catch (err) {
        // res.status(400).json({message: err.message})
        next(err)
    }
}

let editTodo = async (res, req, next) => {
    try {
        let updatedTodo = await todoModel.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if(updatedTodo){
            res.status(200).json({message:"todo was edited successfully", data: updatedTodo})
        }else{
            // res.status(404).json({ message: "todo not found" })
            next(new APIErrors(404, "todo not found"))
        }
    } catch (err) {
        // res.status(500).json({error: err.message})
        next(err)
    }
}

let deleteTodo = async (res, req) => {
    try {
        let deleteTheTodo = await todoModel.findByIdAndDelete(req.params.id)

        if(deleteTheTodo){
            return res.status(204).json({message: "todo deleted!"})
        }else{
            // res.status(404).json({ message: "todo not found" })
            next(new APIErrors(404, "todo not found"))
        }
    } catch (err) {
        // res.status(500).json({error: err.message})
        next(err)
    }
}

module.exports = {createTodo, editTodo, deleteTodo, showTodo}