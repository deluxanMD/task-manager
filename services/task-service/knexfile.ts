require("ts-node/register");
const { env } = require("./src/config/env");

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
    migrations: {
      directory: "./src/migrations",
      extension: "ts",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_TEST_NAME,
    },
    migrations: {
      directory: "./src/migrations",
      extension: "ts",
    },
    pool: {
      min: 1,
      max: 5,
    },
  },

  production: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./dist/migrations",
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};
