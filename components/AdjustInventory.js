import { useEffect } from 'react';
import { BULK_INVENTORY_ADJUSTMENT } from '../queries';

import { useMutation } from '@apollo/client';

export default function AdjustInventory(props) {
  const locationId = 'gid://shopify/Location/47667675295';
  const { inventoryItemAdjustments, setUpdatedProducts } = props;

  const [adjustInventoryMutation, { data, called }] = useMutation(BULK_INVENTORY_ADJUSTMENT, {
    variables: {
      inventoryItemAdjustments,
      locationId,
    }
  });

  useEffect(() => {
    if (!called) {
      adjustInventoryMutation();
    }
    
    if (data.inventoryBulkAdjustQuantityAtLocation.inventoryLevels.length > 0) {
      setUpdatedProducts((previousState) => [...previousState, data.inventoryBulkAdjustQuantityAtLocation.inventoryLevels]);
    }
  }, [data]);

  return (null);
}
