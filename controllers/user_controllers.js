const User = require('../models/user_model');
const DB = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRouter = require('express').Router();
const auth = require("../middleware/auth");
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
// //check if i get avatars
// UserRouter.get('/avatarCode/:code/:gender', async (req, res) => {
//   try {
//       let { code,gender } = req.params; //get the id param.
//       let data = await new DB().FindByAvatarCode("avatars", code,gender);
//       res.status(200).json(data);
//   } catch (error) {
//       res.status(500).json({ error });
//   }
// });
//Create
UserRouter.post('/add', async (req, res) => {
  try {
    let { nickname, email, password, avatars, gender } = req.body;
    let user = new User(nickname, email, password, avatars, gender);
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
    let { nickname, email, password, current_level, level_rank, avatars, gender } = req.body;
    let user = new User(nickname, email, password, current_level, level_rank, avatars, gender);
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
    let { nickname, email, password, avatarCode, gender, avatarUrl } = req.body

    // Validate user input
    if (!(nickname && email && password && avatarCode>=0 && gender && avatarUrl)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await new DB().FindByEmail("users", email);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //if we want to pull the data from db
    // const avatarUrl=await new DB().FindByAvatarCode("avatars",avatarCode,gender);
    // if(!avatarUrl){
    //   return res.status(409).send("Could not find picture, try again!");
    // }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    let user = new User(nickname, email.toLowerCase(), encryptedPassword, avatarCode, gender, avatarUrl);
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
    const user = await new DB().FindByEmail("users", email);

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
//update avatar
UserRouter.put('/update/avatar/:id', async (req, res) => {
  try {
    let { id } = req.params;

    let data = await new DB().UpdateAvatar("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update NickName
UserRouter.put('/update/nickName/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNickName("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update notification:
UserRouter.put('/update/notification/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNotifications("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//add play date to play dates arr
UserRouter.put('/update/addPlayDate/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addPlayDate("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//update current level in user doc 
UserRouter.put('/update/currentLevel/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateCurrentLevel("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update level popularity in user doc 
UserRouter.put('/update/levelPopularity/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelPopularity("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//update current level in user doc 
UserRouter.put('/update/levelRank/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//add level rank to level rank arr
UserRouter.put('/update/addLevelRank/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


UserRouter.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
module.exports = UserRouter;