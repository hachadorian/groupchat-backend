exports.up = function (knex) {
  return knex.schema.createTable("message", (table) => {
    table.string("id").primary().notNullable();
    table.string("channel_id").references("id").inTable("channel");
    table.string("user_id").references("id").inTable("user");
    table.string("message").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("message");
};
