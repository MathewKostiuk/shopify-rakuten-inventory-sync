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
  const digitWithPeriodRegex = /^(([1-9]|10)\.?\s?)([A-Z].*)/;
  if (bracketRegex.test(result)) {
    result = result.replace(bracketRegex, '(');
  }

  if (digitWithPeriodRegex.test(result)) {
    const match = result.match(digitWithPeriodRegex);
    console.log(match);
    result = match[3];
  }

  result = convertDateToShoeSize(result);

  return result.trim();
}

const reverseOnSlash = (string) => {
  const slashRegex = /(.{1,3})\/(.{1,3})/;
  let match = '';
  if (slashRegex.test(string)) {
    match = string.match(slashRegex);
  }
  return `${match[2]}/${match[1]}`;
}

const convertDateToShoeSize = (string) => {
  const reference = {
    '1/2/2006': '6.5',
    '1/2/2007': '7.5',
    '1/2/2008': '8.5',
    '1/2/2009': '9.5',
    '1/2/2010': '10.5',
    '1/2/2011': '11.5',
    '1/2/2012': '12.5',
  }
  if (reference.hasOwnProperty(string)) {
    return reference[string];
  } else {
    return string;
  }
}

module.exports = {
  downloadJsonL,
  assignOptionValues,
  calculateAvailableDelta,
  sanitizeInput,
  reverseOnSlash,
  convertDateToShoeSize,
}
