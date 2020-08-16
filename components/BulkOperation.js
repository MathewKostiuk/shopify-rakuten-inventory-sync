import React, { useEffect } from 'react';

import CheckBulkOperationStatus from './CheckBulkOperationStatus';

import { useMutation } from '@apollo/client';

export default function BulkOperation(props) {
  const {
    mutation,
    onBulkOperationComplete,
  } = props;

  const [bulkOperationQuery, {
    data,
    loading,
    error,
    called,
  }] = useMutation(mutation);

  useEffect(() => {
    if (!called) {
      bulkOperationQuery();
    }
  }, [called]);

  return (
    <CheckBulkOperationStatus
      onBulkOperationComplete={onBulkOperationComplete}
    />
  )
}
