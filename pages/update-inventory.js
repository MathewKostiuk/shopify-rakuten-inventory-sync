import {
  Card,
  Layout,
  Page,
  ProgressBar,
  Stack,
  TextContainer,
} from '@shopify/polaris';
import UpdateInventory from '../components/UpdateInventory';
import Summary from '../components/Summary';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: false,
      notUpdated: [],
      progress: 0,
    }

    this.updateProgress = this.updateProgress.bind(this);
  }

  updateProgress(currentProgress) {
    this.setState({
      progress: currentProgress,
    });
  }

  setCompleted() {
    const notUpdatedURL = `/products/not-updated`;
    const options = {
      method: 'GET',
      mode: 'same-origin',
    }
    fetch(notUpdatedURL, options)
      .then(response => response.json())
      .then(json => {
        this.setState({
          completed: true,
          notUpdated: [...this.state.notUpdated, ...json],
        });
      });
  }

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
                      Once you have added the CSV file, click on the 'Update Inventory' button.
                    </p>
                  </TextContainer>
                </Stack.Item>
                <Stack.Item>
                  <UpdateInventory
                    completed={this.state.completed}
                    setCompleted={() => this.setCompleted()}
                    updateProgress={this.updateProgress}
                    />
                </Stack.Item>
              </Stack>
              <Card.Section>
                {this.state.progress > 0 && this.state.progress !== 100 && 
                  <ProgressBar size="small" progress={this.state.progress} />
                }
              </Card.Section>
            </Card>
          </Layout.Section>
          {this.state.completed && this.state.notUpdated.length > 0 && 
            <Summary notUpdated={this.state.notUpdated} />
          }
        </Layout>
      </Page>
    )
  }
}

export default FileUpload;
