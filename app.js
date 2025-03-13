const express = require("express");
const app = express();
const getEndPoints = require("./controllers/api.controllers");


app.get('/api', getEndPoints);

module.exports = app