const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const Task = require('../models/task')

const user = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,


    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be positive ")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("password cannot contain password ")
            }
        }
    },
    email: {

        type: String,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("This Email is not valid ")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
user.virtual('tasks', {
        ref: "Task",
        localField: "_id",
        foreignField: "owner"
    })
    //!
user.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject

}
user.methods.generateAuthToken = async function() {
    const user = this

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token });
    await user.save()
    return token

}



user.statics.Credentials = async function(email, password) {

    const User = await Users.findOne({
        email
    })
    if (!User) {
        throw new Error('Unable to login')
    }
    // console.log(User, User.password)

    await bcrypt.compare(password, User.password, function(err, isMatch) {

        if (!isMatch) {
            throw new Error("password not match")
        }
    })


    return User;

}
user.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
user.pre('save', async function(next) {
    const user = this
        // console.log(this)
    if (this.isModified("password")) {
        const hash_password = await bcrypt.hash(user.password, 8)
        user.password = hash_password

        // console.log(user["password"])
    }

    next()
});
const Users = mongoose.model("NewUsers", user)
module.exports = Users