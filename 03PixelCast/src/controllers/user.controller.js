import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

//Detail of register controller  
// 1 Get the data from frontend
// 2 Validate the data coming
// 3 Check weather user exist in database or not
// 4 Upload File and Validate
// 5 Insert in database
// 6 After insert remove the password and refreshtoken 
// 7 Return Response With Data


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body
    console.log("username:", username)

    if ([fullname, email, password, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields Required")
    }

    const existedUser = await User.findOne({
        // chek all entry (individually) inside the array of mongo  database
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        ApiError(409, "User already exist with username and email")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath, req.files)
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("Avatar", avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "File not upload on cloudinary ")
    }

    const user = await User.create({
        username,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // const cretedUser = await User.findById(user._id)

    const cretedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!cretedUser) {
        throw new ApiError(500, "Something went wrong when registration user")
    }

    console.log("Request Body:", req.body)
    console.log("Request Field:", req.field)
    console.log("Mongoose Create Response:", user)

    return res.status(201).json(
        new ApiResponse(200, cretedUser, "User is registered successfully")
    )
    // res.status(200).send("OK")
})

const loginUser = asyncHandler(async (req, res) => {
    // 1 Take the user credential
    // 2 Check In mongodb
    // 3 Send Response

})

export { registerUser, loginUser } 