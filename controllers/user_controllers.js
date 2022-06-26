const User = require('../models/user_model');
const DB = require('../utils/db');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const UserRouter = require('express').Router();

//CRUD

//Read all
UserRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("users");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Read one
UserRouter.get('/:id', async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("users", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
UserRouter.post('/add', async (req, res) => {
    try {
        let { nickname, email,password,avatars,gender } = req.body;
        let user = new User(nickname, email,password,avatars,gender);
        let data = await new DB().Insert("users", user);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
UserRouter.put('/update/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let { nickname, email,password,current_level,level_rank,avatars,gender } = req.body;
        let user = new User(nickname, email,password,current_level,level_rank,avatars,gender);
        let data = await new DB().UpdateDocById("users", id, user);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
UserRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("users", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
UserRouter.put('/reactive/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("users", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//Register
UserRouter.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      let { nickname, email,password,avatars,gender } = req.body
  
      // Validate user input
      if (!(email && password&&nickname&&gender&&avatars)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await new DB().FindByEmail("users",email );
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
       // Create user in our database
      let user = new User(nickname, email.toLowerCase(),encryptedPassword,avatars,gender);
      await new DB().Insert("users", user);

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  //Login
  UserRouter.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await new DB().FindByEmail("users",email );
      
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
module.exports = UserRouter;