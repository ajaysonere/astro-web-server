import mongoose from 'mongoose';

const newsletterSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    link :{type: String , required: true},
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export default mongoose.model("newsLetterModel" , newsletterSchema);