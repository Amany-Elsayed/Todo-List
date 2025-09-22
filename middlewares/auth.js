let jws = require("jsonwebtoken")
let util = require("util")

async function auth(req, res, next) {
    let { authorization } = req.headers;


    if(!authorization){
       return res.status(401).json("sign in first")
    }

    try {
        let decoded = await util.promisify(jws.verify)(authorization, process.env.SECRET)
        req.id = decoded.id
        req.role = decoded.roles
        console.log(decoded);
        
        next()
    } catch (err) {
        return res.json({message: err.message})
    }
}

let restrictTo = function(...roles){
    return function(req, res, next){
        if(!roles.includes(req.role)){
            res.status(400).json({status: "error", message: "not authorized to do this"})
        }
        next()
    }
}

module.exports = {auth, restrictTo}