import React, { useState } from 'react';

import FileUploader from './FileUploader';
import Queries from './Queries';

import {
  Spinner,
} from '@shopify/polaris';

export default function UpdateInventory() {
  const [fetched, setFetched] = useState(false);

  const queries = fetched && (
    <>
      <Queries setFetched={setFetched} />
      <Spinner accessibilityLabel="Inventory is processing..." size="large" color="teal" />
    </>
  );

  return (
    <React.Fragment>
      <FileUploader setFetched={setFetched} />
      {queries}
    </React.Fragment>
  )
}
