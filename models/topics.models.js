const db = require("../db/connection");

function fetchTopics(){
    return db.query(`SELECT * FROM TOPICS`).then(({rows})=>{
        return rows
    })
}

module.exports = fetchTopics;