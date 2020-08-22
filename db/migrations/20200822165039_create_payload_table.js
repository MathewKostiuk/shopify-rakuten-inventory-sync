
exports.up = knex => {
  return knex.schema.createTable('payloads', table => {
    table.increments('id').unsigned().primary();
    table.string('inventoryItemId');
    table.integer('availableDelta');
  })
}

exports.down = knex => {
  return knex.schema.dropTable('payloads');
};
