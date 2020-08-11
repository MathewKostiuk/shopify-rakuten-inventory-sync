import { useQuery } from '@apollo/client';
import { CHECK_BULK_OPERATION } from '../queries';

export default function CheckBulkOperationStatus(props) {
  const {
    onBulkOperationComplete,
  } = props;

  const {
    data,
    stopPolling
  } = useQuery(CHECK_BULK_OPERATION, {
    pollInterval: 5000,
    onCompleted: () => onBulkOperationComplete(data, stopPolling),
  });

  return (null)
}
