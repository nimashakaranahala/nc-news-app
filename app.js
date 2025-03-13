const express = require("express");
const app = express();
const getEndPoints = require("./controllers/api.controllers");
const getTopics = require('./controllers/topics.controllers');
const handleNonExistantEndpoint = require("./controllers/errors.controllers");


app.get('/api', getEndPoints);

app.get('/api/topics', getTopics);

app.all('*', handleNonExistantEndpoint);

app.use((err, request, response, next)=>{
response.status(500).send({msg: "Internal server error"})
})

module.exports = app