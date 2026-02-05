import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../Models/User/User.js";
import sendSMS from "../../utils/sms.js";
import sendmail from "../../utils/mailer.js";
import jwt from "jsonwebtoken"

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    let { name, phone, email, password, city} = req.body;
    let user = await  userModel.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ msg: "user alerady exist" });
    }
    let hashpass = await bcrypt.hash(password,10);
    let emailToken = Math.floor(Math.random() * (999999 - 100000) + 10000)
    let phoneToken = Math.floor(Math.random() * (999999 - 100000) + 10000)

    let finalobject = {
      name,
      phone,
      email,
      city,
      password: hashpass,
      isVerifiedToken: {
        emailToken: emailToken,
        phoneToken: phoneToken,
      },
    };
    await userModel.create(finalobject)


    await sendmail(
      email,
      `welcome to blood donation App`,
      
      `please enter the otp to verify\n ${emailToken}`,
    );

    // await sendSMS(phone, `pleasse enter the otp to verify ${phoneToken}`);
    res.status(201).json({ msg: `Account register  sucessfully` });


  } catch (error) {
    res.status(500).json({msg:error})
    console.log(error);
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    let emailotp = req.body.emailotp;

    if (!emailotp) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.emailToken": emailotp });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no user found" });
    }
    user.isVerified.email = true;
    user.isVerifiedToken.emailToken = null;
    await user.save();
    res.status(200).json({ msg: "email registered dsone" });
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:error})
  }
});
router.post("/verify-phone", async (req, res) => {
  try {
    let phoneotp = req.body.phoneotp;

    if (!phoneotp) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.phoneToken": phoneotp });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no user found" });
    }
    user.isVerified.phone = true;
    user.isVerifiedToken.phoneToken = null;
    await user.save();
    res.status(200).json({ msg: "phone registered done" });
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:"error"})
  }
});
router.post("/login",async(req,res)=>{
  try {
   let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    let hashPass = await bcrypt.compare(password, user.password);
    if (!hashPass) {
      return res.status(404).json({ msg: "user not  found " });
    }
        let playload = {
      email,
      id: user._id,
    };
    let token = await jwt.sign(playload, process.env.SECKEY,{expiresIn:"1D"});
    res.status(200).json({ msg: "login done ", token });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:error})
    
  }
})

export default router