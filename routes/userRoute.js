import express from 'express';
import { Login, forgetPassword, getUser, register, resetPassword, updateUser, verifyEmail } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/register" , register);
userRouter.post("/login" , Login);
userRouter.get("/get-user/:id" , getUser);
userRouter.patch("/update-user/:id" , updateUser)
userRouter.post("/forget-password" ,forgetPassword );
userRouter.post("/reset-password" , resetPassword);
userRouter.post("/verify-email/:token", verifyEmail);


export default userRouter;