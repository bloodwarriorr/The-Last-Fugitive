
const Token = require("../models/token");
// const DB = require('../utils/db');
const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post("/reset", async (req, res) => {
    try {
        let { email } = req.body; 

        let user = await DB.FindByEmail("users", email);
        if (!user) {
            return res.status(400).send("User not found!");
        }
        let token = await DB.FindByUserId("token", user._id.toString())

        if (!token) {
            token = new Token(user._id, crypto.randomBytes(32).toString("hex"))
            await DB.Insert("token", token);
        }
     
        const link = `${process.env.BASE_URL}/password-reset/?id=${user._id}&token=${token.token}`;
        await sendEmail(user.email, "Click on the link to reset your password", link);
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});
router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await DB.FindByID("users", req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");
        const token = await DB.FindByUserId("token", user._id.toString())
        if (!token) return res.status(400).send("Invalid link or expired");
        encryptedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = encryptedPassword
        await DB.UpdateDocById("users", user._id, user)
        await DB.DeleteDocById("token", token._id.toString())
        res.send("password reset sucessfully.");
    } catch (error) {
        return res.status(400).send("Something went wrong during reset password");

    }
});

module.exports = router;
