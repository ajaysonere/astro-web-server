import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin", "news-letter", "signals"],
    default: "user",
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  verified: {type : String , default : "no"},
  resetToken: { type: String, default: null },
  resetTokenExpiration: { type: Date, default: null },
});

export default mongoose.model("UserModel" , UserSchema);