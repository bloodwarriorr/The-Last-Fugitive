const Hint = require('../models/hints_model');
const DB = require('../utils/db');

const HintRouter = require('express').Router();

//CRUD

//Read all
HintRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("hints");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Read one
HintRouter.get('/:id', async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("hints", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
HintRouter.post('/add', async (req, res) => {
    try {
        let { name,description } = req.body;
        let hint = new Hint(name,description);
        let data = await new DB().Insert("hints", hint);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
HintRouter.put('/update/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let {  name,description } = req.body;
        let hint = new Hint( name,description);
        let data = await new DB().UpdateDocById("hints", id, hint);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
HintRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("hints", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
HintRouter.put('/reactive/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("hints", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = HintRouter;