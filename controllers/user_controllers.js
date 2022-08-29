const User = require('../models/user_model');
const Guest = require('../models/guest_model')
const DB = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRouter = require('express').Router();
const auth = require("../middleware/auth");
//CRUD

//admin cruds
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


//user cruds
//Register
UserRouter.post("/register", async (req, res) => {


  try {
    // Get user input
    let { nickname, email, password, avatarCode, gender, avatarUrl } = req.body

    // Validate user input
    if (!(nickname && email && password && avatarCode >= 0 && gender && avatarUrl)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await new DB().FindByEmail("users", email);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }


    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    let user = new User(nickname, email.toLowerCase(), encryptedPassword, avatarCode, gender, avatarUrl);
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY
    );
    // save user token
    user.token = token;
    await new DB().Insert("users", user);



    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }

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
        process.env.TOKEN_KEY
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

//following controllers require auth token:

//update avatar
UserRouter.put('/update/avatar/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;

    let data = await new DB().UpdateAvatar("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update NickName
UserRouter.put('/update/nickName/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNickName("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update notification:
UserRouter.put('/update/notification/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNotifications("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//add play date to play dates arr
UserRouter.put('/update/addPlayDate/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addPlayDate("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//update current level in user doc 
UserRouter.put('/update/currentLevel/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateCurrentLevel("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update level popularity in user doc 
UserRouter.put('/update/levelPopularity/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelPopularity("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//update current level in user doc 
UserRouter.put('/update/levelRank/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//add level rank to level rank arr
UserRouter.put('/update/addLevelRank/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//sign up user as guest
UserRouter.post("/guestRegister", async (req, res) => {

  try {

    // Get user input
    let { nickname, email, password } = req.body
    const guest = await new DB().FindGuestByNickname("guests", nickname)

    // Validate user input
    if (!(nickname && email && password)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await new DB().FindByEmail("users", email);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    let user = new User(nickname, email.toLowerCase(), encryptedPassword, guest.avatarCode, guest.gender, 
    guest.avatarUrl,guest.level_rank,guest.current_level,guest.is_notification,guest.time_of_register,guest.play_dates);
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
    await new DB().Insert("users", user);
    // return new user
    res.status(201).json(user);
   await new DB().DeleteDocById("guests",guest._id)
  } catch (err) {
    console.log(err);
  }

});


// UserRouter.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });
module.exports = UserRouter;