import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt, { decode } from 'jsonwebtoken'


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })     // pre function is not run that is define in models validateBeforeSave: false 

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong in generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    //Detail of register controller  
    // 1 Get the data from frontend
    // 2 Validate the data coming
    // 3 Check weather user exist in database or not
    // 4 Upload File and Validate
    // 5 Insert in database
    // 6 After insert remove the password and refreshtoken 
    // 7 Return Response With Data
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
        throw new ApiError(409, "User already exist with username and email")
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
    // 1 Take the user credential (check email_id and password)
    // 2 Check In mongodb (match the password)
    // 3 Send Response (accesstoken and refreshtoken)
    // 4 Send Tokens In Cookies

    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError("username or email required")
    }

    // if you want to search by the email
    // User.findOne({email})
    // User.findOne({username})

    const user = await User.findOne({
        // advance query if you want to search by both ( email , username )
        // MongoDB Operator:
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    //  find user
    //  remove cookies
    //  remove refresh token


    // find and update the entry
    await User.findByIdAndUpdate(
        // the req.user is set in auth.middleware or In VeryfyJWT
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // take refresh token
    // check with database
    // now generate new accesstoken 

    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodeToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "referesh token is expired or used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access Token Refreshed"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    // we are checking authentication in middleware
    // 1)find old user
    // 2)check the oldpassword 
    // 3)change password in database
    const { oldPassword, newPassword, confPassword } = req.body

    if (newPassword == confPassword) {
        throw new ApiError(400, "Password is not matched")
    }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfullys"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"))
})

const updateAccountDetail = asyncHandler(async (req, res) => {
    // 1) take info
    // 2) recognise the whatever change
    // 3) update in user 
    // 4) generate refreshtoken and accesstoken 
    // 5) update the cookies
    // 6) save in database

    const { fullname, email } = req.body
    if (!fullname || !email) {
        throw new ApiError(400, "All Fileds are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Detail updated successfully"))

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    // take the path of file uploaded on server req.file
    // upload on cloudinary
    // validate
    // save in the database

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Error While Uploading on avatar")
    }

    const user = await findByIdAndUpdate(req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar is udpated Successfully"))
})

const udpateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage) {
        throw new ApiError(400, "Error While Uploading CoverImage File")
    }

    const user = await User.findByIdAndUpdate(
        req.body?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    if (!user) {
        throw new ApiError(500, "Something went wrong while uploading the coverImage")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage Updated Successfully"))
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateUserAvatar, udpateUserCoverImage } 