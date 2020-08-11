const readline = require('readline');
const util = require('util');

const downloadJsonL = async (url) => {
  const response = await fetch(url);
  const parsedJSON = [];

  const rl = readline.createInterface({
    input: response.body,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    parsedJSON.push(JSON.parse(line));
  }
  return parsedJSON;
}

const assignOptionValues = (json) => {
  return json.selectedOptions ? {
    rakuten_id: json.sku,
    option_1: json.selectedOptions[0].name || '',
    option_2: json.selectedOptions[1] && json.selectedOptions[1].name || '',
    shopify_inventory_item_id: json.inventoryItem.id,
  } : {
      rakuten_id: json.sku,
      option_1: '',
      option_2: '',
      shopify_inventory_item_id: json.inventoryItem.id,
    };
}

module.exports = {
  downloadJsonL,
  assignOptionValues,
}
