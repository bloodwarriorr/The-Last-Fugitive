
// const DB = require('../utils/db');
const DBSingleton = require('../utils/db-singleton');
const DB = DBSingleton.getInstance();
const HintRouter = require('express').Router();

//CRUD

//Read all
HintRouter.get('/', async (req, res) => {
    try {
        let data = await DB.FindAll("hints");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = HintRouter;