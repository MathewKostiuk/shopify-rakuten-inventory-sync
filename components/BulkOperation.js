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
    called,
  }] = useMutation(mutation);

  useEffect(() => {
    if (!called) {
      bulkOperationQuery();
    }
  }, [called]);

  const bulkOperation = called && !loading && (
    <CheckBulkOperationStatus
      onBulkOperationComplete={onBulkOperationComplete}
    />
  )

  return (
    <>
      {bulkOperation}
    </>
  )
}
