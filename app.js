const express = require("express");
const app = express();
const getEndPoints = require("./controllers/api.controllers");
const getTopics = require('./controllers/topics.controllers');
const handleNonExistantEndpoint = require("./controllers/errors.controllers");
const articles = require("./db/data/test-data/articles");
const getArticlesById = require('./controllers/articles.controller')

app.use(express.json());

app.get('/api', getEndPoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticlesById)

app.all('*', handleNonExistantEndpoint);

app.use((err, request, response, next)=>{
response.status(500).send({msg: "Internal server error"})
})

module.exports = app