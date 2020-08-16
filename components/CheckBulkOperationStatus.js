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
    pollInterval: 10000,
  });

  useEffect(() => {
    onBulkOperationComplete(data, stopPolling);
  }, [data])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>`Error... ${error.message}`</div>
  }

  return (null);
}
