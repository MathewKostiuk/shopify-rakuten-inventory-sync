const knex = require('../db/index');
const csvParser = require('csv-parser');
const fs = require('fs');
const { sanitizeInput, reverseString } = require('../utils');

async function insertProducts(products) {
  return Promise.all(products.map(async product => {
    return await knex('rakuten_products').insert({
      rakuten_id: product.Lot,
      option_1: sanitizeInput(product.SIZE),
      option_2: sanitizeInput(product.COLOR),
      rakuten_stock: product.Stock,
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
  // Primary query: CSV matches Shopify
  const primary = await primaryQuery(rakutenJSON);

  if (primary.length > 0) {
    return primary;
  } else {

    const secondary = await secondaryQuery(rakutenJSON);
    if (secondary.length > 0) {
      return secondary;
    } else {

      const tertiary = await tertiaryQuery(rakutenJSON);
      if (tertiary.length > 0) {
        return tertiary;
      } else {

        const fourth = await fourthQuery(rakutenJSON);
        if (fourth.length > 0) {
          return fourth
        } else {

          const fifth = await fifthQuery(rakutenJSON);
          if (fifth.length > 0) {
            return fifth;
          } else {
            console.log(rakutenJSON);
          }
        }
      }
    }
  }
}

async function primaryQuery(json) {
  // Primary query: CSV matches Shopify
  const primary = await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: json.option_1,
    option_2: json.option_2,
  }).update({
    shopify_inventory_item_id: json.shopify_inventory_item_id,
    shopify_stock: json.shopify_stock,
  }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));

  return primary;
}

async function secondaryQuery(json) {
  // Secondary: Option 2 is missing from CSV
  const secondary = await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: json.option_1,
    option_2: '',
  }).update({
    shopify_inventory_item_id: json.shopify_inventory_item_id,
    shopify_stock: json.shopify_stock,
  }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));

  return secondary;
}

async function tertiaryQuery(json) {
  // Third: Option values are reversed
  const tertiary = await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: json.option_2,
    option_2: json.option_1,
  }).update({
    shopify_inventory_item_id: json.shopify_inventory_item_id,
    shopify_stock: json.shopify_stock,
  }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));

  return tertiary;
}

async function fourthQuery(json) {
  // Fourth: option text is reversed eg. S/36 instead of 36/S
  const fourth = await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: reverseString(json.option_1),
    option_2: json.option_2,
  }).update({
    shopify_inventory_item_id: json.shopify_inventory_item_id,
    shopify_stock: json.shopify_stock,
  }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));

  return fourth;
}

async function fifthQuery(json) {
  const fifth = await knex('rakuten_products').whereNull('shopify_inventory_item_id').andWhere({
    rakuten_id: json.rakuten_id,
    option_1: json.option_1,
  }).update({
    shopify_inventory_item_id: json.shopify_inventory_item_id,
    shopify_stock: json.shopify_stock,
  }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));

  return fifth;
}


module.exports = {
  insertProducts,
  deleteAllProducts,
  processCSV,
  updateRakutenProducts,
};
