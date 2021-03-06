import React, { useCallback } from 'react';

import {
  Stack,
  DropZone,
  Thumbnail,
  Caption,
  List,
  Banner,
  Button,
  Spinner,
} from '@shopify/polaris';

export default function FileUploader(props) {
  const { setFetched, updateProgress, fetched } = props;
  const imageURL = 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304';
  const [files, setFiles] = React.useState([]);
  const [rejectedFiles, setRejectedFiles] = React.useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles, rejectedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
    setRejectedFiles(rejectedFiles);
  },
    [],
  );

  const handleCSVUpload = useCallback(async () => {
    updateProgress(5);
    const data = new FormData()
    data.append('csv', files[0]);
    const endpoint = `/products/csv`;
    const options = {
      method: 'POST',
      mode: 'same-origin',
      body: data,
    }
    await fetch(endpoint, options);
    setFetched(() => true);
    updateProgress(10);
  },
    [files],
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;

  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={file ?
              imageURL :
              window.URL.createObjectURL(file)
            }
          />
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  );

  const errorMessage = hasError && (
    <Banner
      title="The following file couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .csv.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <Stack vertical>
      {errorMessage}
      <DropZone
        allowMultiple={false}
        errorOverlayText="File type must be .csv"
        onDrop={handleDropZoneDrop}
        labelHidden={false}
      >
        {fileUpload}
        {uploadedFiles}
      </DropZone>
      <Stack.Item fill>
        <Stack>
          {files.length > 0 &&
            <Button
              primary
              onClick={handleCSVUpload} >
              Update Inventory
          </Button>
          }
          {fetched &&
            <Spinner accessibilityLabel="Inventory is processing..." size="large" color="teal" />
          }
        </Stack>
      </Stack.Item>
    </Stack>
  );
}
