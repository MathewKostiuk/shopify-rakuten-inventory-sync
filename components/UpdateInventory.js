import React, { useState } from 'react';

import FileUploader from './FileUploader';
import Queries from './Queries';

export default function UpdateInventory() {
  const [fetched, setFetched] = useState(false);

  const queries = fetched && <Queries fetched={fetched} />;

  return (
    <React.Fragment>
      <FileUploader setFetched={setFetched} />
      {queries}
    </React.Fragment>
  )
}
