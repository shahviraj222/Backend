import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// cors configuration 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// express settings applying limit how much data our server can take to save the server
app.use(express.json({ limit: "16kb" }))

// this is use for handling data coming from the url 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//this is used to store the asset in my server 
app.use(express.static("public"))

// for using cookies
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'

// router decleration
// because we have sperated the routers so we have to use the middleware for calling back 

app.use('/api/v1/users', userRouter)

// the url look like
// http://localhost:8000/api/v1/users    = now the routes path
// http://localhost:8000/api/v1/users/register   = finally the register is called
export { app }