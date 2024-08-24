import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    landMark: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
})

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: addressSchema,
            required: true
        }
    },
    { timestamps: true }
)

export const Hospital = mongoose.model.apply("Hospital", hospitalSchema)  