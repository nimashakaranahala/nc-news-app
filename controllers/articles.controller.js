const fetchArticleById = require("../models/articles.models");

function getArticlesById(req, res, next) {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: "Invalid article ID" });
    }

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            if (err.status) {
                res.status(err.status).send({ msg: err.msg });
            } else {
                next(err);
            }
        });
}

module.exports = getArticlesById;
