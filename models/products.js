const knex = require('../db/index');
const csvParser = require('csv-parser');
const fs = require('fs');
const { assignOptionValues, calculateAvailableDelta } = require('../utils');
const { sanitizeInput, reverseOnSlash } = require('../utils');

async function getPayload() {
  return await knex.raw(`
    SELECT shopify_inventory_item_id, available_delta
	  FROM rakuten_products
	  WHERE 
     shopify_inventory_item_id IS NOT NULL
     AND available_delta IS NOT NULL
	   AND available_delta != 0;
  `)
}

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
  const threeOptionMatch = await fetchWithThreeFields(rakutenJSON);
  if (threeOptionMatch.length === 1) {
    return await updateByID(threeOptionMatch[0].id, rakutenJSON);
  }

  const twoOptionMatch = await fetchWithTwoFields(rakutenJSON);
  if (twoOptionMatch.length === 1) {
    return await updateByID(twoOptionMatch[0].id, rakutenJSON);
  }

  const oneOptionMatch = await fetchWithOneField(rakutenJSON);
  if (oneOptionMatch.length === 1) {
    return await updateByID(oneOptionMatch[0].id, rakutenJSON);
  }

  const fieldsSwitched = await fetchWithThreeFieldsSwitched(rakutenJSON);
  if (fieldsSwitched.length === 1) {
    return await updateByID(fieldsSwitched[0].id, rakutenJSON);
  }

  const reversedOptionOneQuery = await reversedOptionOne(rakutenJSON);
  if (reversedOptionOneQuery.length > 0) {
    return await updateByID(reversedOptionOneQuery[0].id, rakutenJSON);
  }
  return [];
}

async function updateByID(id, json) {
  const productItem = await knex('rakuten_products').where({
    id: id,
  });

  return await knex('rakuten_products').where({
    id: id,
  })
    .update({
      shopify_inventory_item_id: json.shopify_inventory_item_id,
      shopify_stock: json.shopify_stock,
      available_delta: calculateAvailableDelta(productItem[0].rakuten_stock, json.shopify_stock),
    }, ['rakuten_stock', 'shopify_stock', 'shopify_inventory_item_id']).catch(e => console.log(e));
}

async function fetchWithThreeFields(json) {
  return await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: json.option_1,
    option_2: json.option_2 || '',
  })
    .whereNull('shopify_inventory_item_id')
    .catch(e => console.log(e, json));
}

async function fetchWithThreeFieldsSwitched(json) {
  return await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: json.option_2,
    option_2: json.option_1 || '',
  })
    .whereNull('shopify_inventory_item_id')
    .catch(e => console.log(e, json));
}

async function fetchWithTwoFields(json) {
  return await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
  })
    .whereNull('shopify_inventory_item_id')
    .andWhere('option_1', 'like', `${json.option_1.substring(0, 3)}%`)
    .catch(e => console.log(e, json));
}

async function fetchWithOneField(json) {
  return await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
  })
    .whereNull('shopify_inventory_item_id')
    .catch(e => console.log(e, json));
}

async function reversedOptionOne(json) {
  const reversed = reverseOnSlash(json.option_1);
  return await knex('rakuten_products').where({
    rakuten_id: json.rakuten_id,
    option_1: reversed || '',
  })
    .whereNull('shopify_inventory_item_id')
    .catch(e => console.log(e, json));
}

const handlePayloadProcessing = async (json) => {
  const filteredJSON = json.filter(obj => {
    if (obj.inventoryItem && obj.sku) {
      return obj;
    }
  });

  const updatedProducts = await Promise.all(filteredJSON.map(async json => {
    const assigned = assignOptionValues(json);
    const updated = await updateRakutenProducts(assigned);
    return [...updated];
  })).catch(e => console.log(e));
}

module.exports = {
  insertProducts,
  deleteAllProducts,
  processCSV,
  updateRakutenProducts,
  getPayload,
  handlePayloadProcessing
};
