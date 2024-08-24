import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const orderSchema = new mongoose.Schema(
    {
        orderPrice: {
            type: Number,
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        orderItems: {
            type: [orderItemSchema],


            //second way to define the orderItems 
            // type: [{
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: "Product"
            //     },
            //     quantity: {
            //         type: Number,
            //         default: 1
            //     }
            // }]
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Canceled", "Delivered"],      // this give the option you only choose three types 
            default: "Pending"
        }
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)