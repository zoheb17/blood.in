
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    index: true,
  },
  age: {
    type: Number,
    required: true,
  },
  lastDonationDate: {
    type: Date,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  userEmail : {
    type : String,
    required : true
  },
  userName : {
    type : String,
    required : true
  },
  isActive : {
    type : Boolean,
    default : true 
  }
},{
    timestamps : true
});

const donorModel = await mongoose.model("Donor",donorSchema);

export default donorModel;
