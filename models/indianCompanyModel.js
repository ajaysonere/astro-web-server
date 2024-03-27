import mongoose from 'mongoose';

const indianCompanyModel = new mongoose.Schema({
    Symbol: { type: String },
    Name: { type: String },
});

export default mongoose.model("indianCompanyModel" , indianCompanyModel);