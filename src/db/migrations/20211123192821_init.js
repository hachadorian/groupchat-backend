exports.up = function (knex) {
  return knex.schema.createTable("user", (table) => {
    table.string("id").unique().primary();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("name").nullable();
    table.string("bio").nullable();
    table.string("phone").nullable();
    table.string("image").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user");
};
