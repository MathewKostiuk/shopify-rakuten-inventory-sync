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
    shopify_stock: json.inventoryItem.inventoryLevel.available,
    shopify_inventory_item_id: json.inventoryItem.id,
  } : {
      rakuten_id: json.sku,
      option_1: '',
      option_2: '',
      shopify_stock: json.inventoryItem.inventoryLevel.available,
      shopify_inventory_item_id: json.inventoryItem.id,
    };
}

const calculateAvailableDelta = (rakuten_stock, shopify_stock) => {
  return rakuten_stock - shopify_stock;
}

const sanitizeInput = (string) => {
  let result = string;
  const bracketRegex = /\\\(/g;
  const digitWithPeriodRegex = /(\d{1,2}\.\s?)([A-Z].*)/;
  if (bracketRegex.test(result)) {
    result = result.replace(bracketRegex, '(');
  }

  if (digitWithPeriodRegex.test(result)) {
    const match = result.match(digitWithPeriodRegex);
    result = match[2];
  }
  return result;
}

const reverseString = (string) => {
  return string.split('').reverse().join('');
}

module.exports = {
  downloadJsonL,
  assignOptionValues,
  calculateAvailableDelta,
  sanitizeInput,
  reverseString,
}
