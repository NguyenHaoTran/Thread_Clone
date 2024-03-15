import express from "express";
import {signupUser, 
        loginUser, 
        logoutUser,
        followUnfollowUser,
        updateUser, getUSerProfile
    } from '../controllers/userController.js'
import protectRoute from "../middlewares/protectRoute.js";





const router = express.Router();


router.get("/profile/:username", getUSerProfile)
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update/:id", protectRoute, updateUser);



//login
//update profile
//follow

export default router;