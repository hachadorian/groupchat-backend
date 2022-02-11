exports.up = function (knex) {
  return knex.schema.createTable("channel", (table) => {
    table.string("id").primary().notNullable();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("channel");
};
