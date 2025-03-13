const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=>{
  return seed(data)
})


afterAll(()=>{
  return db.end()
})

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