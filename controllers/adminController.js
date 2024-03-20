import HttpError from "../models/errorModel.js";
import newsletterModel from "../models/newsletterModel.js";
import userModel from "../models/userModel.js";
import path , {dirname} from 'path';
import {fileURLToPath} from 'url';

//  handle the news letter upload
export const newsLetterUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new HttpError(`File upload failed`, 422));
    }

    const fileName = req.file.filename;
    
    const __dirname = dirname(fileURLToPath(import.meta.url));
    
    console.log(req.file);
    
    const link = path.join(__dirname , `../uploads/${fileName}`)

    const response = await newsletterModel.create({ name:fileName , link:req.file.path});

    res.status(200).json("File uploaded successfully");
  } catch (error) {
      console.log(error);
      return next(new HttpError(`Failed to upload news-letter` , 422));
  }
};


// fetch all the news letter from the database
export const getNewsLetter = async(req , res , next) => {
     try {
         const response = await newsletterModel.find({});
         res.status(200).json(response);
     } catch (error) {
         return next(new HttpError(`Failed to get the news-letter` , 422));
     }
}


// get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const data = await userModel.find().select("-password");

    if (!data) {
      return next(new HttpError("Users not found", 422));
    }

    res.status(200).json(data);
  } catch (error) {
    return next(new HttpError("Failed to fetch all users", 500));
  }
};

// update the user detals by admin
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return next(new HttpError("Invalid user ID format", 400));
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return next(new HttpError("User does not exist", 404));
    }

    const { name, email, address, phone, role } = req.body;

    if (!name || !email || !address || !phone || !role) {
      return next(new HttpError("Please fill all fields", 400));
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { name, email, address, phone, role },
        { new: true, runValidators: true } 
      )
      .select("-password");
      
    res.status(200).json({
      message: `User ${userId} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Failed to update user information", 500));
  }
};


// this is controller help us to delete the user
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return next(new HttpError(`Unable to delete user`, 422));
    }

    const response = await userModel.findByIdAndDelete(id);

    if (!response) {
      // If no user found with the given ID
      return next(new HttpError(`User not found`, 404));
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return next(new HttpError(`Failed to delete user`, 500));
  }
};


// get the users from the database
export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return next(new HttpError(`User ID is not provided`, 422));
    }

    const response = await userModel
      .findOne({ _id: userId })
      .select("-password");

    if (!response) {
      return next(new HttpError(`User not found for id ${userId}`, 404));
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return next(new HttpError(`Failed to get user`, 500));
  }
};
