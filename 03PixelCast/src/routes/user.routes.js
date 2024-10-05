import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateUserAvatar, udpateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route('/register').post(
    // middle ware to handle files 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router
    .route('/login')
    .post(loginUser)

// secured routes 
// here the verifyJWT work first and then logoutuser run 
router
    .route('/logout')
    .post(verifyJWT, logoutUser)

router
    .route('/refresh-token')
    .post(refreshAccessToken)

router
    .route('/change-password')
    .post(verifyJWT, changeCurrentPassword)

router
    .route('/current-user')
    .get(verifyJWT, getCurrentUser)

router
    .route('/update-account')
    .patch(verifyJWT, updateAccountDetail)

router
    .route('/update-avatar')
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router
    .route('/update-cover-image')
    .patch(verifyJWT, upload.single("/coverImage"), udpateUserCoverImage)

router
    .route('/c/:username')
    .get(verifyJWT, getUserChannelProfile)

router
    .route('/history')
    .get(verifyJWT, getWatchHistory)

export default router 