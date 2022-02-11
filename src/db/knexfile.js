require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env" : "../../.env",
});

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
  },
};
