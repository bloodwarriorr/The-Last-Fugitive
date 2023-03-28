
// const DB = require('../utils/db');
const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const LevelRouter = require('express').Router();

//CRUD

//Read all
LevelRouter.get('/', async (req, res) => {
    try {
        let data = await DB.FindAll("levels");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = LevelRouter;