exports.up = function (knex) {
  return knex.schema.createTable("member", (table) => {
    table.string("id").unique().primary().notNullable();
    table.string("channel_id").references("id").inTable("channel");
    table.string("user_id").references("id").inTable("user");
    table.boolean("is_creator");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("member");
};
