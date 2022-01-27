require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env" : "../../.env",
});

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + "/migrations",
    },
  },
};
