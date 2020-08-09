import { gql, useMutation, useLazyQuery } from '@apollo/client';

const BULK_OPERATION_PRODUCT_INFO = gql`
mutation {
  bulkOperationRunQuery(
   query: """
    {
      products {
        edges {
          node {
            id
            variants {
              edges {
                node {
                  id
                  inventoryItem {
                    id
                  }
                  selectedOptions {name : value}
                  sku
                }
              }
            }
          }
        }
      }
    }
    """
  ) {
    bulkOperation {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
`

const GET_ALL_PRODUCTS_BULK_OPERATION = gql`
  query {
    currentBulkOperation {
      id
      status
      errorCode
      createdAt
      completedAt
      objectCount
      fileSize
      url
      partialDataUrl
    }
  }
`

export default function BulkOperationProducts() {
  const [called, setCalled] = React.useState(false);
  const [getProductsQuery, {
    loading,
    error,
    data,
    stopPolling
  }] = useLazyQuery(GET_ALL_PRODUCTS_BULK_OPERATION, {
    pollInterval: 10000,
  });

  const [getProductsMutation, {
    loading: mutationLoading,
    error: mutationError,
  }] = useMutation(BULK_OPERATION_PRODUCT_INFO);

  if (data && data.currentBulkOperation.status === 'COMPLETED') {
    stopPolling();
    console.log(data.currentBulkOperation.url);
  }

  React.useEffect(() => {
    if (!called) {
      getProductsMutation();
      setCalled(true);
      getProductsQuery();
    }
  }, [called]);

  return (
    <div>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
    </div>
  )
};
