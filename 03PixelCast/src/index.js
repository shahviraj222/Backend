import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

// dotenv.config()

const port = process.env.PORT || 8000
dotenv.config({
    path: '.env'
})
connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Middleware Error:", err)
        })
        app.listen(port, () => {
            console.log("Server is runing at PORT : ", port)
        })
    })
    .catch((err) => {
        console.log("Error:", err)
    })