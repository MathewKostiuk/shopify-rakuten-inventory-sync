import React, { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { CHECK_BULK_OPERATION } from '../queries';

export default function CheckBulkOperationStatus(props) {
  const {
    onBulkOperationComplete,
  } = props;

  const {
    data,
    loading,
    error,
    stopPolling,
  } = useQuery(CHECK_BULK_OPERATION, {
    pollInterval: 5000,
  });

  useEffect(() => {
    onBulkOperationComplete(data, stopPolling);
  }, [data]);

  return (null);
}
