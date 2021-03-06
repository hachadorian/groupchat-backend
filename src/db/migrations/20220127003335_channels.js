exports.up = function (knex) {
  return knex.schema.createTable("channel", (table) => {
    table.string("id").unique().primary().notNullable();
    table.string("name").unique().notNullable();
    table.string("description").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("channel");
};
