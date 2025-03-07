const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("tests to check common errors", () => {
  test("check all comments for a specific article have the correct article_id", () => {
    return db
      .query(`SELECT * FROM comments WHERE article_id = 3`)
      .then(({ rows: article3Comments }) => {
        expect(article3Comments.length).toBe(2);

        return db.query(
          `SELECT * FROM comments WHERE comment_id = 10 OR comment_id = 11`
        );
      })
      .then(({ rows: article3Comments }) => {
        article3Comments.forEach((comment) => {
          expect(comment.article_id).toBe(3);
        });
      });
  });

  test("check all comments foreign keys are not null", () => {
    return db.query(`SELECT * FROM comments;`).then(({ rows: comments }) => {
      expect(comments.length).toBeGreaterThan(0);

      comments.forEach(({ article_id, author }) => {
        expect(article_id).not.toBeNull();
        expect(author).not.toBeNull();
      });
    });
  });

  test("check all articles foreign keys are not null", () => {
    return db.query(`SELECT * FROM articles;`).then(({ rows: articles }) => {
      expect(articles.length).toBeGreaterThan(0);

      articles.forEach(({ topic, author, votes }) => {
        expect(votes).not.toBeNull();
        expect(topic).not.toBeNull();
        expect(author).not.toBeNull();
      });
    });
  });

  test("articles table has foreign key constraints", () => {
    return db
      .query(
        `SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'articles';`
      )
      .then(({ rows }) => {
        const foreignKeyRows = rows.filter((row) => {
          return row.constraint_type === "FOREIGN KEY";
        });
        expect(foreignKeyRows.length).toBe(2);

        foreignKeyRows.forEach((row) => {
          expect(row.constraint_name).toMatch(/(topic|author)/i);
        });
      });
  });

  test("comments table has foreign key constraints", () => {
    return db
      .query(
        `SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'comments';`
      )
      .then(({ rows }) => {
        const foreignKeyRows = rows.filter((row) => {
          return row.constraint_type === "FOREIGN KEY";
        });
        console.log(foreignKeyRows);
        expect(foreignKeyRows.length).toBe(2);

        foreignKeyRows.forEach((row) => {
          expect(row.constraint_name).toMatch(/(article_id|author)/i);
        });
      });
  });
});