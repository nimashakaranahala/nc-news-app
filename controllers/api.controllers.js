const endpoints = require("../endpoints.json");

function getEndPoints(request, response){
    response.status(200).send({endpoints})
}
module.exports = getEndPoints