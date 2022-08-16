const { User } = require("../models/user_model");
const Token = require("../models/token");
const DB = require('../utils/db');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

router.post("/reset", async (req, res) => {
    try {
    let { email } = req.body; //get the id param.
    let user = await new DB().FindByEmail("users", email);
        console.log(user._id)
        let token = await new DB().FindByID("token",user._id)
        if (!token) {
            token=new Token(user._id,crypto.randomBytes(32).toString("hex"))
            await new DB().Insert("token", token);
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
       
        const user = await new DB().FindByID("users",req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
        
        user.password = req.body.password;
        await new DB().UpdateDocById("users",user)
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;