const todoModel = require("../model/todo")
const {auth} = require("../middlewares/auth")
const APIErrors = require("../errors/APIerrors")

let showTodo = async (req, res, next) => {
    try {
        let todos = await todoModel.find().populate("userId")
        res.json(todos)
    } catch (err) {
        // res.status(400).json({message: err.message})
        next(err)
    }
}

let createTodo = async (req, res, next) => {
    let newTodo = req.body
    newTodo.userId = req.id
    try {
        let theNewtodo = await todoModel.create(newTodo)
        res.status(201).json({message:"success" , data: theNewtodo});
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

let deleteTodo = (req , res ) => {
    let { id } = req.params
    todoModel.findByIdAndDelete(id).then((todo) => {
    if (todo) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  }).catch((err) => {
    res.status(400).json({ message: err.message });
  }); 
    
}

module.exports = {createTodo, editTodo, deleteTodo, showTodo}