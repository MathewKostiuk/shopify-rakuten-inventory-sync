import BulkOperation from './BulkOperation';
import GetLocationID from './GetLocationID';

import { BULK_OPERATION_PRODUCT_INFO } from '../queries';

export default function Queries(props) {
  const {
    fetched,
  } = props;
  
  const [locationID, setLocationID] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  const onProductBulkActionComplete = (data, stopPolling) => {
    if (data.currentBulkOperation.status !== 'COMPLETED') {
      return;
    }

    stopPolling();
    const endpoint = `/product-info`;
    const options = {
      method: 'POST',
      mode: 'same-origin',
      body: data.currentBulkOperation.url,
    }
    fetch(endpoint, options)
    .then(response => response.json())
    .then(json => setProducts(products => [...products, ...json]));
  }

  const locationIDQuery = !fetched && (
    <GetLocationID 
      setLocationID={setLocationID}
    />
  );

  const productBulkOperation = fetched && (
    <BulkOperation 
      mutation={BULK_OPERATION_PRODUCT_INFO}
      onBulkOperationComplete={onProductBulkActionComplete}
    />
  );

  return (
    <div>
      {locationIDQuery}
      {productBulkOperation}
    </div>
  )
}
