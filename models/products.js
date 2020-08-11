const knex = require('../db/index');
const csvParser = require('csv-parser');
const fs = require('fs');

async function insertProducts(products) {
  return Promise.all(products.map(async product => {
    return await knex('rakuten_products').insert({
      rakuten_id: product.Lot,
      option_1: product.SIZE,
      option_2: product.COLOR,
      stock: product.Stock,
    });
  }));
}

async function deleteAllProducts() {
  return await knex('rakuten_products').del();
}

async function processCSV(csv) {
  const results = [];
  fs.createReadStream(csv)
    .pipe(csvParser())
    .on('data', (data) => {
      if (data.Stock !== '') {
        results.push(data);
      }
    })
    .on('end', async () => {
      await deleteAllProducts();
      await insertProducts(results);
    })
    .on('error', (error) => Promise.reject(error));
}

async function updateRakutenProducts(rakutenJSON) {
  return await knex('rakuten_products').where({
    rakuten_id: rakutenJSON.rakuten_id,
    option_1: rakutenJSON.option_1,
    option_2: rakutenJSON.option_2,
  }).update({
    shopify_inventory_item_id: rakutenJSON.shopify_inventory_item_id,
  }, ['stock', 'shopify_inventory_item_id']);
}

module.exports = {
  insertProducts,
  deleteAllProducts,
  processCSV,
  updateRakutenProducts,
};
