import React, { useState, useCallback, useEffect } from 'react';

import BulkOperation from './BulkOperation';
import AdjustInventory from './AdjustInventory';
import { BULK_OPERATION_PRODUCT_INFO } from '../queries';

export default function Queries(props) {
  const { setFetched, setCompleted } = props;
  const [productsToUpdate, setProductsToUpdate] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [updatingInventory, setUpdatingInventory] = useState(false);

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
      const endpoint = `/products/product-info`;
      const options = {
        method: 'POST',
        mode: 'same-origin',
        body: data.currentBulkOperation.url,
      }
      fetch(endpoint, options);
      setTimeout(() => {
        const payloadEndpoint = '/products/payload';
        const options = {
          method: 'GET',
          mode: 'same-origin',
        }
        fetch(payloadEndpoint, options)
          .then(response => response.json())
          .then(json => {
            const brokenDownArray = breakDownArray(json);
            if (brokenDownArray.length > 0) {
              setProductsToUpdate(brokenDownArray);
              setUpdatingInventory(true);
              setCompleted();
            } else {
              setFetched(false);
              setCompleted();
            }
          })
      }, 75000);
    },
    [],
  );

  const productBulkOperation = productsToUpdate.length === 0 && (
    <BulkOperation
      mutation={BULK_OPERATION_PRODUCT_INFO}
      onBulkOperationComplete={onProductBulkActionComplete}
    />
  );

  const adjustInventory = productsToUpdate.length > 0 && (
    <>
      {productsToUpdate.map((batch, index) => {
        return <AdjustInventory
          inventoryItemAdjustments={batch}
          setUpdatedProducts={setUpdatedProducts}
          key={index}
        />
      })}
    </>
  );

  useEffect(() => {
    if (updatingInventory && updatedProducts.length === productsToUpdate.length) {
      setFetched(false);
      setUpdatingInventory(false);
    }
  }, [updatedProducts]);

  return (
    <>
      {productBulkOperation}
      {adjustInventory}
    </>
  )
}
