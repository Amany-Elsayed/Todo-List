const express = require("express")
const router = express.Router()
const {createUser, returnFirstName, deleteUser, editUser, login, updatePassword} = require("../controllers/users")
const { auth } = require("../middlewares/auth")

router.post("/", createUser)
router.get("/", returnFirstName)
router.delete("/:id", deleteUser)
router.patch("/:id", editUser)
router.post("/login", login)
router.patch("/updatePassword", auth, updatePassword)

module.exports = router