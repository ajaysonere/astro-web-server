import express from "express";
import upload from "../middleware/multer.js";
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
  newsLetterUpload,
  getNewsLetter,
} from "../controllers/adminController.js";
const adminRoute = express.Router();

adminRoute.get("/get-all-users", getAllUsers);
adminRoute.get("/get-news-letter" , getNewsLetter);
adminRoute.get("/get-user/:id", getUser);
adminRoute.post("/news-letter-upload", upload.single("file"), newsLetterUpload);
adminRoute.patch("/update-user/:id", updateUser);
adminRoute.delete("/delete-user/:id", deleteUser);

export default adminRoute;
