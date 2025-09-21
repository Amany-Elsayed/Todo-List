const {usersModel} = require("../model/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

let createUser = async (req, res, next) => {
    try {
        let newUser = req.body
        let theNewUser = await usersModel.create(newUser)
        res.status(201).json(theNewUser);
    } catch (err) {
        // res.status(400).json({message: err.message})
        next({status: 400, message: err.message})
    }
}

let returnFirstName = async (req, res, next) => {
    try {
        let theFirstName = await usersModel.find({}, "firstName")
        res.status(200).json(theFirstName)
    } catch (err) {
        // res.status(500).json({message: err.message})
        next({status: 400, message: err.message})
    }
}

let deleteUser = async (req, res, next) => {
    try {
        let deleteTheUser = await usersModel.findByIdAndDelete(req.params.id)

        if(deleteTheUser){
            return res.status(204).json({message: "user deleted!"})
        }else{
            return res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        // res.status(500).json({error: err.message})
        next({status: 400, message: err.message})
    }
}

let editUser = async (req, res, next) => {
    try {
        let theUserAfterEdit = await usersModel.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if(theUserAfterEdit){
            return res.status(200).json({message:"user was edited successfully", user: theUserAfterEdit})
        }else{
            return res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        // res.status(500).json({error: err.message})
        next({status: 400, message: err.message})
    }
}

let login = async function (req, res, next) {
    try{
    let { email, password } = req.body;

    if (!email || !password) {
    //   return res.status(400).json({ message: "Email and password are required" });
        return next({status: 400, message: "email and password are required"})
    }

    let theUser = await usersModel.findOne({ email: email });
    if (!theUser) {
    //   return res.status(404) .json({ message: "User not found" });
        return next({status: 404,message: "user not found"})
    }

    let isValid = await bcrypt.compare(password, theUser.password);
    if (!isValid) {
    //   return res.status(400).json({ message: "Email or password is wrong" });
        return next({status: 400, message: "email or password is wrong"})
    }

    let token = jwt.sign({ id: theUser._id, email: theUser.email, roles: theUser.roles }, process.env.SECRET)

    res.status(200).json({ token: token })
  } catch (err) {
    // res.status(500).json({ error: err.message });
    next({status: 500, message: err.message})
  }
}

let updatePassword = async function(req, res, next){
    let {currentPassword, newPassword} = req.body

    if(!currentPassword || !newPassword){
       return res.status(401).json("required")
        // return next({status: 401, message: "required"})
    }
    
    let theUser = await usersModel.findById(req.id)

    let isValid = await bcrypt.compare(currentPassword, theUser.password)
    if(!isValid){
        res.status(401).json("wrong password")
        // return next({status: 400, message: "wrong password"})
    }

    try {
        theUser.password = newPassword
        await theUser.save()

        let token = jwt.sign({ id: theUser._id, email: theUser.email, roles: theUser.roles }, process.env.SECRET)


        res.status(200).json({ token: token })
    } catch (err) {
       return res.json(err)
    }
}

module.exports = {createUser, returnFirstName, deleteUser, editUser, login, updatePassword}