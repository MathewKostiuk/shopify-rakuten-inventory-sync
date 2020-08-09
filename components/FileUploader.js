import {
  Stack,
  DropZone,
  Thumbnail,
  Caption,
  List,
  Banner,
  Button,
} from '@shopify/polaris';

import BulkOperationProducts from './BulkOperationProducts';

export default function FileUploader() {
  const [files, setFiles] = React.useState([]);
  const [rejectedFiles, setRejectedFiles] = React.useState([]);
  const [fetching, setFetching] = React.useState(false);
  const hasError = rejectedFiles.length > 0;
  const imageURL = 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304';

  const handleDropZoneDrop = React.useCallback(
    (_dropFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const processCSV = files.length && <Button
    primary
    onClick={async () => {
      const data = new FormData()
      data.append('csv', files[0]);
      const endpoint = `/csv`;
      const options = {
        method: 'POST',
        mode: 'same-origin',
        body: data,
      }
      await fetch(endpoint, options);
      setFetching(true);
    }}
  >
    Process CSV File
  </Button>

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

  const fetchingMessage = fetching && (
    <BulkOperationProducts fetching={fetching} />
  );

  return (
    <Stack vertical>
      {errorMessage}
      <DropZone
        accept="text/csv"
        allowMultiple={false}
        errorOverlayText="File type must be .csv"
        onDrop={handleDropZoneDrop}
        labelHidden={false}
      >
        {fileUpload}
        {uploadedFiles}
      </DropZone>
      <Stack.Item>
        {processCSV}
      </Stack.Item>
      <Stack.Item>
        {fetchingMessage}
      </Stack.Item>
    </Stack>
  );
}
