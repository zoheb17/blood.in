import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../models/User.js";
import sendSMS from "../../utlis/sms.js";
import sendmail from "../../utlis/mailer.js";
import jwt from "jsonwebtoken"

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    let { name, bloodGroup, phone, email, password, city, age } = req.body;
    let user = await  userModel.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ msg: "user alerady exist" });
    }
    let hashpass = await bcrypt.hash(password,10);
    let emailToken = Math.random().toString(36).slice(2, 10);
    let phoneToken = Math.random().toString(36).slice(2, 10);

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
    let emailurl = `http://localhost:5000/doner/verify-email/${emailToken}`;
    let phoneurl = `http://localhost:5000/doner/verify-email/${phoneToken}`;

    await sendmail(
      email,
      `welcome to blood donation App`,
      
      `please verify link ${emailurl}`,
    );

    // await sendSMS(phone, `pleasse click the link below ${phoneurl}`);
    res.status(201).json({ msg: `Account register  sucessfully` });


  } catch (error) {
    res.status(500).json({msg:error})
    console.log(error);
  }
});

router.get("/verify-email/:emailToken", async (req, res) => {
  try {
    let emailToken = req.params.emailToken;

    if (!emailToken) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.emailToken": emailToken });
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
router.get("/verify-phone/:phoneToken", async (req, res) => {
  try {
    let phoneToken = req.params.phoneToken;

    if (!phoneToken) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.phoneToken": phoneToken });
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