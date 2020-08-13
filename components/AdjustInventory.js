import { useEffect } from 'react';
import { BULK_INVENTORY_ADJUSTMENT } from '../queries';

import { useMutation } from '@apollo/client';

export default function AdjustInventory(props) {
  const locationId = 'gid://shopify/Location/43559682093';
  const { inventoryItemAdjustments } = props;

  const [adjustInventoryMutation, { data }] = useMutation(BULK_INVENTORY_ADJUSTMENT, {
    variables: {
      inventoryItemAdjustments,
      locationId,
    }
  });

  useEffect(() => {
    adjustInventoryMutation();
  }, []);

  return (null);
}
