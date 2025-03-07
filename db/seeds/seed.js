const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("../seeds/utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  // Drop Tables
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
      .then(() => db.query(`DROP TABLE IF EXISTS users;`))
      .then(() => db.query(`DROP TABLE IF EXISTS topics;`))

      // Create Tables
      .then(() =>
        db.query(`
      CREATE TABLE topics (
        slug VARCHAR(20) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000) NOT NULL
      );
    `)
      )
      .then(() =>
        db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(1000) NOT NULL,
        avatar_url VARCHAR(1000) NOT NULL
      );
    `)
      )
      .then(() =>
        db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
        author VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000) NOT NULL
      );
    `)
      )
      //Do I need INT not Null for artucle_ID
      .then(() =>
        db.query(`
          CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE, 
            body TEXT NOT NULL,
            votes INT DEFAULT 0,
            author VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `)
      )

      // Insert Topics Data
      .then(() => {
        const formattedTopics = topicData.map(
          ({ slug, description, img_url }) => [slug, description, img_url]
        );
        const insertTopicsQuery = format(
          `INSERT INTO topics (slug, description, img_url) VALUES %L;`,
          formattedTopics
        );
        return db.query(insertTopicsQuery);
      })

      // Insert Users Data
      .then(() => {
        const formattedUsers = userData.map(
          ({ username, name, avatar_url }) => [username, name, avatar_url]
        );
        const insertUsersQuery = format(
          `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
          formattedUsers
        );
        return db.query(insertUsersQuery);
      })

      // Insert Articles Data
      .then(() => {
        const formattedArticles = articleData.map(
          ({
            title,
            topic,
            author,
            body,
            created_at,
            votes = 0,
            article_img_url,
          }) => {
            const { created_at: convertedCreatedAt } = convertTimestampToDate({
              created_at,
            });
            return [
              title,
              topic,
              author,
              body,
              convertedCreatedAt,
              votes,
              article_img_url,
            ];
          }
        );

        const insertArticlesQuery = format(
          `
        INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L;
      `,
          formattedArticles
        );
        return db.query(insertArticlesQuery);
      })

      // .then(() => {
      //   const formattedComments = commentData.map(
      //     ({ article_id, body, created_at, votes = 0, author }) => {
      //       const { created_at: formattedCreatedAt } = convertTimestampToDate({
      //         created_at,
      //       });
      //       return [article_id, body, votes, author, formattedCreatedAt];
      //     }
      //   );

      //   const insertCommentsQuery = format(
      //     `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`,
      //     formattedComments
      //   );

      //   return db.query(insertCommentsQuery);
      // })
  );
};

module.exports = seed;
