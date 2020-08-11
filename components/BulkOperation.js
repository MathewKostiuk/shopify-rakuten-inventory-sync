import { useMutation } from '@apollo/client';
import CheckBulkOperationStatus from './CheckBulkOperationStatus';

export default function BulkOperation(props) {
  const {
    mutation,
    onBulkOperationComplete,
  } = props;

  const [called, setCalled] = React.useState(false);

  const [bulkOperationQuery, {
    loading,
    error,
  }] = useMutation(mutation);

  if (!called) {
    bulkOperationQuery();
    setCalled(() => true);
  }
  
  return (
    <CheckBulkOperationStatus
    onBulkOperationComplete={onBulkOperationComplete}
    />
  )
}
