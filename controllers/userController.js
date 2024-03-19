import userModel from "../models/userModel.js";
import HttpError from "../models/errorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { verifyGmail } from "../config/Mailer.js";

function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, address, phone, role } = req.body;

    if (!name || !email || !password || !address || !phone) {
      return next(new HttpError(`Please fill all the fields`, 422));
    }

    const existUser = await userModel.findOne({ email });

    if (existUser && userExist.verified === "yes") {
      return next(new HttpError(`User already exist`, 422));
    }

    const trimPassword = password.trim();

    if (trimPassword.length < 8) {
      return next(new HttpError(`Password must be 8 character long`, 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimPassword, salt);

    if (phone.length > 15) {
      return next(new HttpError(`Phone number should be less than 15`, 422));
    }

    const resetToken = generateResetToken();

    const newUser = await userModel.create({
      name,
      password: hashedPassword,
      email,
      phone,
      address,
      role,
      verified: "no",
      resetToken: resetToken,
      resetTokenExpiration: Date.now() + 3600000,
    });

    const resetLink = `http://3.27.6.29:5173/#/verify-email/${resetToken}`;

    const subject = "Please verify your email address";

    const message =
      "Welcome to Astro Dunia , please verfiy your email address.";

    verifyGmail(email, resetLink, subject, message);

    res.status(201).json(`New user ${email} registered`);
  } catch (error) {
    return next(new HttpError(`Failed to register user`, 500));
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log(req.body);

    if (!email || !password) {
      return next(new HttpError(`Please fill all fields`, 422));
    }

    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return next(new HttpError(`User does not exist`, 422));
    }

    if (userExist.verified === "no") {
      return next(new HttpError("Please verify your email address", 422));
    }
    
    

    const verifyPassword = await bcrypt.compare(password, userExist.password);

    if (!verifyPassword) {
      return next(new HttpError("email or password is incorrect", 422));
    }

    const token = jwt.sign(
      { id: userExist._id, name: userExist.name },
      "asdfkkljksdfwefsdfkjeijsd",
      { expiresIn: "5d" }
    );

    res.status(200).json({
      role: userExist.role,
      id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError(`Failed to login`, 500));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return next(new HttpError(`user not found`, 404));
    }

    const user = await userModel.findOne({ _id: userId }).select("-password");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
  }
};


export const updateUser = async(req , res , next) => {
    try {
         const userId = req.params.id;
         
         if(!userId){
            return next(new HttpError(`user not found` , 404));
         }
         
         const {name  , email , password , newPassword , confirmPassword , address , phone} = req.body;
         
         if(!name || !email || !password || !newPassword || !confirmPassword || !address || !phone) {
              return next(new HttpError('Please fill all fields' , 422));
         }
         
         const userExist  = await userModel.findOne({_id : userId});
         
         const verifyPassword = await bcrypt.compare(
           password,
           userExist.password
         );

         if (!verifyPassword) {
           return next(new HttpError("current password is incorrect", 422));
         }
         
         if(newPassword !== confirmPassword){
            return next(new HttpError('New password and confirm password does not match' , 422));
         }
         
         if(newPassword.length < 8){
             return next(new HttpError('Password length must be 8 character long' , 422));
         }
         
         if(userExist.email !== email){
            const checkMail = await userModel.findOne({email});
         
           if(checkMail){
               return next(new HttpError(`Email is already in use` , 422));
           }
         }
         
         
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(newPassword, salt);
         
         const updateUser = await userModel.findByIdAndUpdate({_id: userId} , {name , email , password:hashedPassword , phone , address} , {new: true});
         
         
         res.status(200).json({success: true , data : updateUser});
         
    } catch (error) {
        return next(new HttpError(`Failed to update user` , 422));
    }
}


export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userExist = await userModel.findOne({ email });

    if (!userExist) {
      return next(
        new HttpError(
          `User not found. Please check your email for verification!`,
          404
        )
      );
    }

    const resetToken = generateResetToken();

    userExist.resetToken = resetToken;
    userExist.resetTokenExpiration = Date.now() + 3600000;
    await userExist.save();

    const resetLink = `http://3.27.6.29:5173/reset-password/${resetToken}`;

    const subject = "Reset your password ";

    const message = "Reset your password using this link ";

    verifyGmail(email, resetLink, subject, message);

    res.status(200).json("check for mail for reset password");
  } catch (error) {
    console.error(error);
    return next(new HttpError(`Something went wrong. Please try again.`, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return next(new HttpError(`please try again , after sometime`, 422));
    }

    if (password !== confirmPassword) {
      return next(
        new HttpError("password does not match with confirm password", 422)
      );
    }

    const trimPassword = password.trim();

    if (trimPassword.length < 8) {
      return next(new HttpError(`Password must be 8 character long`, 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimPassword, salt);

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;
    
    console.log(token);

    const userExist = await userModel.findOne({ resetToken: token });

    if (!userExist) {
      return next(
        new HttpError(`Invalid token , try again after sometime`, 422)
      );
    }

    userExist.verified = "yes";
    userExist.save();

    res.status(200).json("user verfied successfully");
  } catch (error) {
    return next(new HttpError(`failed to verify email`, 500));
  }
};
