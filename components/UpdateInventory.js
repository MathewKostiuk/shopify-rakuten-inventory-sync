import React, { useState } from 'react';

import FileUploader from './FileUploader';
import Queries from './Queries';

import {
  Banner,
} from '@shopify/polaris';

export default function UpdateInventory(props) {
  const [fetched, setFetched] = useState(false);
  const { completed, setCompleted, updateProgress } = props;

  const uploader = !completed && (
    <FileUploader
      fetched={fetched}
      setFetched={setFetched}
      updateProgress={updateProgress}
    />
  );

  const queries = fetched && (
    <Queries
      setFetched={setFetched}
      setCompleted={setCompleted}
      updateProgress={updateProgress}
    />
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
