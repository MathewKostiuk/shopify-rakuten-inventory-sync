import FileUploader from './FileUploader';
import Queries from './Queries';

export default function UpdateInventory() {
  const [fetched, setFetched] = React.useState(false);

  return (
    <React.Fragment>
      <FileUploader setFetched={setFetched} />
      <Queries fetched={fetched} />
    </React.Fragment>
  )
}
