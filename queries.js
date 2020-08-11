import { gql } from '@apollo/client';

const CHECK_BULK_OPERATION = gql`
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

const GET_LOCATION_ID = gql`
  query	{
    locations(first:1) {
      edges {
        node {
          id
        }
      }
    }
  }
`

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

export {
  CHECK_BULK_OPERATION,
  GET_LOCATION_ID,
  BULK_OPERATION_PRODUCT_INFO,
}
