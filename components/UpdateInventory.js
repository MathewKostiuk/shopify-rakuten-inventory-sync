import React, { useState } from 'react';

import FileUploader from './FileUploader';
import Queries from './Queries';

import {
  Spinner,
  Banner,
} from '@shopify/polaris';

export default function UpdateInventory(props) {
  const [fetched, setFetched] = useState(false);
  const { completed, setCompleted } = props;

  const uploader = !completed && (
    <FileUploader setFetched={setFetched} />
  );

  const queries = fetched && (
    <>
      <Queries setFetched={setFetched} setCompleted={setCompleted} />
      <Spinner accessibilityLabel="Inventory is processing..." size="large" color="teal" />
    </>
  );

  const successBanner = completed && (
    <Banner
      title="The stock was successfully updated!"
      status="success"
    />
  );

  return (
    <React.Fragment>
      {uploader}
      {queries}
      {successBanner}
    </React.Fragment>
  )
}
