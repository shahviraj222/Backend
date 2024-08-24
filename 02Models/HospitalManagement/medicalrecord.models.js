import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
    {

    },
    { timestamps: true }
)

export const Medical = mongoose.model.apply("Medical", medicalSchema)  