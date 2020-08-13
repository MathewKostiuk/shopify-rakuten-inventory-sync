import React, { useEffect } from 'react';

import CheckBulkOperationStatus from './CheckBulkOperationStatus';

import { useMutation } from '@apollo/client';

export default function BulkOperation(props) {
  const {
    mutation,
    onBulkOperationComplete,
  } = props;

  const [bulkOperationQuery, {
    loading,
    error,
  }] = useMutation(mutation);

  useEffect(() => {
    bulkOperationQuery();
  }, []);

  return (
    <CheckBulkOperationStatus
      onBulkOperationComplete={onBulkOperationComplete}
    />
  )
}
