import dotenv from 'dotenv'
import connectDB from './db/index.js'
// dotenv.config()
dotenv.config({
    path: '.env'
})
connectDB()