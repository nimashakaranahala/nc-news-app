const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const articles = require("../db/data/test-data/articles.js");

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(data)
})


afterAll(()=>{
  return db.end()
})

//1
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

//2
describe("GET /api/topics", () => {
  test("200: responds with and array of correctly formatted topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body}) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topics)=>{
          expect(typeof topics.slug).toBe("string")
          expect(typeof topics.description).toBe("string")
        })
      });
  });
  test("404: responds with an error message for a non-existing endpoint", () => {
    return request(app)
      .get("/api/yyyyy")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid path");
      });
  });
});

//3 Get/api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
  test("200: responds with and array of correctly formatted articles objects", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body}) => {
        const article = body.article;
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
        })
      });
  });
  test("400: responds with an error message when given an invalid format of an article_id", () => {
    return request(app)
      .get("/api/articles/the123")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });

  test("404: responds with an error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });