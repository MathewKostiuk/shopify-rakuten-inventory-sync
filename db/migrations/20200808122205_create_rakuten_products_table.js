
exports.up = knex => {
  return knex.schema.createTable('rakuten_products', table => {
    table.increments('id').unsigned().primary();
    table.string('rakuten_id').notNullable();
    table.string('option_1');
    table.string('option_2');
    table.integer('rakuten_stock');
    table.integer('shopify_stock');
    table.string('shopify_inventory_item_id');
  })
}

exports.down = knex => {
  return knex.schema.dropTable('rakuten_products');
};
