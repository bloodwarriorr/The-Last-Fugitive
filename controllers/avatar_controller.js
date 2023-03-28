
// const DB = require('../utils/db');
const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const AvatarRouter = require('express').Router();

//CRUD
//Read all
AvatarRouter.get('/', async (req, res) => {
    try {
        let data = await DB.FindAll("avatars");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = AvatarRouter;