import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
        },
        password: {
            type: String,
            require: true,

        }
    },
    { timestamps: true }
)

export const User = mongoose.model("User", userSchema)