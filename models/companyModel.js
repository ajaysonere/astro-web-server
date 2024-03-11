import mongoose from 'mongoose';

const companyName = mongoose.Schema({
    Symbol : {type: String , required: true},
    Name : {type: String, required: true}
});

export default mongoose.model("companyName" , companyName);