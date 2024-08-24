import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        qualification: {
            type: String,
            required: true
        },
        experienceInYear: {
            type: Number,
            default: 0
        },
        worksInHospital: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true
        }],
        shifts: {
            type: String,
            enum: ["Day", "Night", "Evening", "Afternoon"]
        }
    },
    { timestamps: true }
)

export const Doctor = mongoose.model.apply("Doctor", doctorSchema)  