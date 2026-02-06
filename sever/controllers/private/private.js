import express from "express";
import donorModel from "../../Models/Donor/Donor.js";
import userModel from "../../Models/User/User.js";

const router = express.Router();

router.post("/donor-form", async (req, res) => {
  try {
    let { bloodGroup, age, city } = req.body;
    let user = await userModel.findOne({ email: req.user.email });
    let donor = await donorModel.findOne({ userEmail: user.email });
    if (donor) {
      return res.status(400).json({ msg: "You are already registered as a donor" });
    } 
    // const THREE_MONTHS = 90 * 24 * 60 * 60 * 1000;
    // const diff = Date.now() - new Date(donor.lastDonationDate).getTime();

    // if (diff < THREE_MONTHS) {
    //   return res.status(400).json({
    //     msg: "You can donate again after 3 months",
    //   });
    // }
    let finalobject = {
      bloodGroup,
      age,
      city:user.city,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone
    };
    await donorModel.create(finalobject);
    res.status(200).json({ msg: "you are added as an donor" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/getalldonors", async (req, res) => {
  try {
    const donors = await donorModel.find()
    console.log(donors)
    if (!donors) {
      return res
        .status(404)
        .json({ msg: "cannot find donors of the matching bloodgroup" });
    }
    res.status(200).json(donors);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/update-user",async (req,res)=>{
    try {
        let user = req.user;
        let userInput = req.body;
        await userModel.updateOne({email : user.email},{$set:userInput});
        res.status(200).json({msg : "user updated sucessfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/blood-request", async (req, res) => {
  try {
    const { bloodGroup } = req.body;
    console.log(bloodGroup)
    const user = await userModel.findOne({ email: req.user.email });
    console.log(user)
    const donors = await donorModel.find({
      bloodGroup,
      city: user.city,
      isAvailable: true,
    });
    console.log(donors)
    if (!donors.length) {
      return res.status(404).json({ msg: "No donors found" });
    }

    res.json(donors);
  } catch (error) {
    res.status(500).json(error);
  }
});


export default router;