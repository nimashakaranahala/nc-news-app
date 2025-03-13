
function handleNonExistantEndpoint(request, response, next){
    response.status(404).send({msg:"Invalid path"})
}


module.exports = handleNonExistantEndpoint;