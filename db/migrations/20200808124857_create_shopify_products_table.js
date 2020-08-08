exports.up = knex => knex.schema.createTable('shopify_product_variants', table => {
  table.increments('id').unsigned().primary();
  table.string('variant_id').notNullable();
  table.string('option_1');
  table.string('option_2');
  table.integer('inventory_item_id');
})

exports.down = knex => knex.schema.dropTable('rakuten_products');
