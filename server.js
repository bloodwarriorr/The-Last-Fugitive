//load env vars
require('dotenv').config();

//libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//port
const PORT = process.env.PORT || 5008;

//create server
const server = express();
server.use(express.json()); //enable json support
server.use(cors()); //enable global access
server.use(helmet()); //more defense

//api routes
server.use('/api/users', require('./controllers/user_controllers'));

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));