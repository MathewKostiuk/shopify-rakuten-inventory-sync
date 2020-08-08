import { EmptyState, Layout, Page } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {

  static contextType = Context;
  
  render() {
    const app = this.context;
    const redirectToProduct = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/file-upload',
      );
    };

    return (
      <Page>
      <TitleBar
        title="Home"
        primaryAction={{
          content: 'Get started',
          onAction: redirectToProduct,
        }}
      />
        <Layout>
          <EmptyState
            heading="Update the stock on Shopify to match Rakuten"
            action={{
              content: 'Get Started',
              onAction: redirectToProduct,
            }}
            image={img}
          >
            <p>Upload the Rakuten .csv file to update the inventory.</p>
          </EmptyState>
        </Layout>
    </Page>
    )
  }
}

export default Index;
