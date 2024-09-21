import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true        // this allow the user search (incease the load)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,     //cloudinary url
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,       //challenge of storing what are we going to store encoded or direct string
        required: [true, "Password Is Required"]
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

//pre is the mongoose hook we can apply of diffrenet funcitons
// pre save hook is a function which run just before the schema save in monogoose
// This Context in hook refer to the instance of doument to be saved
// this.isModified("password") = this check weather the old password field change or not

userSchema.pre("save", async function (next)           //this is middleware so we have to take next so next pass the flag to called one
{
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)     // 8  is round for algo
    next();
})

// we can define our own method also for any filed.

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)                //here the this.password come from the mongodb
}

userSchema.methods.generateAccessToken = function () {

    // jwt.sign give the key
    return jwt.sign(
        // payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },

        // secret
        process.env.ACCESS_TOKEN_SECRET,

        // expiry
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {

    // jwt.sign give the key
    return jwt.sign(
        // payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },

        // secret
        process.env.REFRESH_TOKEN_SECRET,

        // expiry
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)