const Avatar = require('../models/avatar_model');
const DB = require('../utils/db');

const AvatarRouter = require('express').Router();

//CRUD

//Read all
AvatarRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("avatars");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Read one
AvatarRouter.get('/:id', async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("avatars", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
AvatarRouter.post('/add', async (req, res) => {
    try {
        let { gender,options } = req.body;
        let avatar = new Avatar(gender,options);
        let data = await new DB().Insert("avatars", avatar);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
AvatarRouter.put('/update/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let {  gender,options } = req.body;
        let avatar = new Avatar( gender,options);
        let data = await new DB().UpdateDocById("avatars", id, avatar);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//remove option from avatar options
AvatarRouter.put('/update/avatarOption/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let {code} = req.body;
        let data = await new DB().removeAvatarOption("avatars", id, code);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//add choice option in avatar option array
AvatarRouter.put('/update/addAvatarOption/:id', async (req, res) => {
    try {
        let { id } = req.params;
        
        let data = await new DB().addAvatarOption("avatars", id, req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



//Delete
AvatarRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("avatars", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
AvatarRouter.put('/reactive/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("avatars", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = AvatarRouter;