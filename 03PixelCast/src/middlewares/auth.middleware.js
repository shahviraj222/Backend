// why we need this middle ware because we want to do logout of user we can't directly take the emial id from user it will give anybody's data

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // req.header("Authorization")?.replace("Bearer ", "") this is for mobile version where we don't have cookies to store the data
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            // if we don't find the accessToken
            throw new ApiError(401, "Unauthorized request")
        }

        //After decoding the token you can access the payload that is set when you have created a token 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            // if the access token is invalid prevention by the hacking
            throw new ApiError(401, "Invalid Access Token")
        }

        // because we are using the middle ware we can set this parameter 
        req.user = user               //req.user we can access 
        next()
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid access Token")
    }
})