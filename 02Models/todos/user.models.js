// in mongoose model the name is always count as lowercase and 's' in last added. so here database stores "users"
// The timestramps help to save two things when the model is created and when it is updated

// Relations of documents in mongodb how to do it
// we can do it by this type : mongoose. Schema. Types ,  and then providing the reference

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],

        },

    }, { timestamps: true }
)

export const User = mongoose.model("User", userSchema)

