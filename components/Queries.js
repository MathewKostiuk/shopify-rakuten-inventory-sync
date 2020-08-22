import React, { useState, useCallback } from 'react';

import BulkOperation from './BulkOperation';
import AdjustInventory from './AdjustInventory';
import { BULK_OPERATION_PRODUCT_INFO } from '../queries';

export default function Queries() {
  const [products, setProducts] = useState([]);

  const breakDownArray = (array) => {
    const numberOfArraysNeeded = Math.ceil((array.length / 100));
    const result = [];
    let index = 0;
    for (let i = 0; i < numberOfArraysNeeded; i++) {
      const newArray = [];
      for (let j = index; j < index + 100; j++) {
        if (array[j] !== undefined) {
          newArray.push(array[j]);
        }
      }
      result.push(newArray);
      index = index + 100;
    }
    return result;
  }

  const onProductBulkActionComplete = useCallback(
    (data, stopPolling) => {
      if (!data || !data.currentBulkOperation || data.currentBulkOperation.status !== 'COMPLETED') {
        return;
      }

      stopPolling();
      const endpoint = `/product-info`;
      const options = {
        method: 'POST',
        mode: 'same-origin',
        body: data.currentBulkOperation.url,
      }
      fetch(endpoint, options);
      setTimeout(() => {
        const payloadEndpoint = '/payload';
        const options = {
          method: 'GET',
          mode: 'same-origin',
        }
        fetch(payloadEndpoint, options)
          .then(response => response.json())
          .then(json => {
            const brokenDownArray = breakDownArray(json);
            return setProducts(brokenDownArray);
          })
      }, 60000);
    },
    [],
  );

  const productBulkOperation = products.length === 0 && (
    <BulkOperation
      mutation={BULK_OPERATION_PRODUCT_INFO}
      onBulkOperationComplete={onProductBulkActionComplete}
    />
  );

  const adjustInventory = products.length > 0 && (
    <>
      {products.map((batch, index) => {
        return <AdjustInventory
          inventoryItemAdjustments={batch}
          key={index}
        />
      })}
    </>
  );

  return (
    <>
      {productBulkOperation}
      {adjustInventory}
    </>
  )
}
