import mongoose from "mongoose";
import { SubTodo } from "./sub_todos.models";

const todoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        complete: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,    //this is type in which we are saying that we are defining other model
            ref: "User"

        },

        //Array of subtodos 
        SubTodo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubTodo"
            },
        ],
    },
    { timestramps: true }
)

export const Todo = mongoose.model("Todo", todoSchema)