const express = require("express")
const {auth, restrictTo} = require("../middlewares/auth")
const router = express.Router()
const {createTodo, editTodo, deleteTodo, showTodo} = require("../controllers/todo")

router.get("/", auth, showTodo)
router.post("/", auth, restrictTo("admin", "user"), createTodo)
router.patch("/:id", auth, restrictTo("admin", "user"), editTodo)
router.delete("/:id", auth, restrictTo("admin"), deleteTodo)

module.exports = router