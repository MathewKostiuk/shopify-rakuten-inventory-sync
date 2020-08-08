import {
  Heading,
  Card,
  Layout,
  Page,
  TextStyle,
  Stack,
  TextContainer,
} from '@shopify/polaris';
import FileUploader from '../components/FileUploader';

class FileUpload extends React.Component {

  render() {

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card
            title="Rakuten CSV File Upload"
            sectioned
            >
              <Stack>
                <Stack.Item fill>
                  <TextContainer>
                    <p>
                      Once you have added the CSV file, click on the 'Process CSV' button.
                    </p>
                  </TextContainer>
                </Stack.Item>
                <Stack.Item>
                  <FileUploader />
                </Stack.Item>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }
}

export default FileUpload;
