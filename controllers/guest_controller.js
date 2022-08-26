const Guest=require('../models/guest_model')
const jwt = require('jsonwebtoken');
const DB = require('../utils/db');
const GuestRouter = require('express').Router();


//sign up user as guest
GuestRouter.post("/register", async (req, res) => {
  try {
    // Create guest user in db
    let guest = new Guest();
    let nickname=guest.nickname
     // Create token
     const token = jwt.sign(
      { user_id: guest._id, nickname },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    guest.token = token;
    await new DB().Insert("guests", guest);
    // return new user
    res.status(201).json(guest);
  } catch (err) {
    console.log(err);
  }
  });
  module.exports = GuestRouter;


 