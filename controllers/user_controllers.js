const User = require('../models/user_model');
const DB = require('../utils/db');

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
        let { nickname, email,password,current_level,level_rank,avatars,gender } = req.body;
        let user = new User(nickname, email,password,current_level,level_rank,avatars,gender);
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

module.exports = UserRouter;