
exports.up = knex => knex.schema.createTable('rakuten_products', table => {
  table.increments('id').unsigned().primary();
  table.string('rakuten_id').notNullable();
  table.string('option_1')
  table.string('option_2')
  table.integer('stock')
})

exports.down = knex => knex.schema.dropTable('rakuten_products');
