import { useQuery } from '@apollo/client';
import { GET_LOCATION_ID } from '../queries';

export default function GetLocationID(props) {
  const { setLocationID } = props;
  const {
    data,
  } = useQuery(GET_LOCATION_ID, {
    onCompleted: () => setLocationID(() => data.locations.edges[0].node.id),
  });

  return (null);
}
