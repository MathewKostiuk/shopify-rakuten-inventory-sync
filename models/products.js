const knex = require('../db/index');

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

module.exports = {
  insertProducts,
};
