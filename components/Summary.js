import {
  DataTable,
  Scrollable,
  Card,
  Layout,
} from '@shopify/polaris';

export default function Summary(props) {
  const { notUpdated } = props;

  return (
    <Layout.Section>
      <Card title="Failed to Update" sectioned>
        <p>
          The following products did not update correctly. Please double-check that the product is in Shopify by searching with the Rakuten ID.
        </p>
        <Scrollable shadow style={{ height: '700px' }}>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'text',
              'numeric',
            ]}
            headings={[
              'Rakuten ID',
              'Option 1',
              'Option 2',
              'Rakuten Stock',
            ]}
            rows={notUpdated}
          />
        </Scrollable>
      </Card>
    </Layout.Section>
  );
}
