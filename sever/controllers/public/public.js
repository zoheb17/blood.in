import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../Models/User/User.js";
import sendmail from "../../utils/mailer.js";
import jwt from "jsonwebtoken"
import { verificationEmailTemplate, welcomeEmailTemplate } from "../../utils/emailTemplates.js";

const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    let { name, phone, email, password, city} = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }
    let user = await  userModel.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({ msg: "user alerady exist" });
    }
    let hashpass = await bcrypt.hash(password,10);
    // 6-digit email verification token
    let emailToken = String(Math.floor(100000 + Math.random() * 900000));
    // phone token no longer used in the primary flow
    let phoneToken = null;

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

    // Build verification link for email-link verification flow
    const frontendBase =
      process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyLink = `${frontendBase}/verify-email?token=${emailToken}`;

    // Send verification email
    const verificationEmail = verificationEmailTemplate({ verifyLink });
    await sendmail(email, verificationEmail.subject, {
      text: verificationEmail.text,
      html: verificationEmail.html,
    });

    res.status(201).json({ msg: `Account register  sucessfully` });


  } catch (error) {
    res.status(500).json({msg:error})
    console.log(error);
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    // Accept token from body or query to support email link flow
    let emailotp = req.body.emailotp || req.body.token || req.query.token;

    if (!emailotp) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.emailToken": emailotp });
    if (!user) {
      return res.status(400).json({ msg: "invalid token or no user found" });
    }
    user.isVerified.email = true;
    user.isVerifiedToken.emailToken = null;
    await user.save();

    // Optional welcome email after successful verification
    if (user.email) {
      const welcomeEmail = welcomeEmailTemplate();
      await sendmail(user.email, welcomeEmail.subject, {
        text: welcomeEmail.text,
        html: welcomeEmail.html,
      });
    }
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
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.isVerified?.email) {
      return res.status(403).json({ msg: "Please verify your email before login" });
    }
    let hashPass = await bcrypt.compare(password, user.password);
    if (!hashPass) {
      return res.status(401).json({ msg: "Invalid password" });
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