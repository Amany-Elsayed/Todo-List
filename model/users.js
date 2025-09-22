const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const usersSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            minLength: 8
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type:String,
            required: true,
            unique:true,
            validate:{
                validator:function (email){
                    return /^[a-zA-Z]{4,10}[0-9]{0,4}(@)(gmail|yahoo)(.com)$/.test(email)
                },
                message: (prop)=> `${prop.value} is not correct `
            }
        },
        firstName:{
            type: String,
            required: true,
            minLength: 3,
            maxLength: 15
        },
        lastName:{
            type: String,
            required: true,
            minLength: 3,
            maxLength: 15
        },
        dob: Date,
        roles: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        }
    }, {timestamps: true}
)

usersSchema.pre("save", async function(next){
    try {
        let salt = await bcrypt.genSalt(10)
        let hashed = await bcrypt.hash(this.password, salt)
        this.password = hashed
        next()
    } catch (err) {
        next(err);
    }
})

const usersModel = mongoose.model("User", usersSchema);
module.exports = {usersModel}