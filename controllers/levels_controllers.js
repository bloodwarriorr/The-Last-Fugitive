const Level = require('../models/levels_model');
const DB = require('../utils/db');

const LevelRouter = require('express').Router();

//CRUD

//Read all
LevelRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("levels");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Read one
LevelRouter.get('/:id', async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("levels", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
LevelRouter.post('/add', async (req, res) => {
    try {
        let { code,map,player,enemies,step_cap,difficulty } = req.body;
        let level = new Level(code,map,player,enemies,step_cap,difficulty);
        let data = await new DB().Insert("levels", level);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
LevelRouter.put('/update/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let { code, map,player,enemies,step_cap,difficulty } = req.body;
        let level = new Level( code,map,player,enemies,step_cap,difficulty);
        let data = await new DB().UpdateDocById("levels", id, level);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
LevelRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("levels", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
LevelRouter.put('/reactive/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("levels", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = LevelRouter;