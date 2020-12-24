import GoogleMapReact from 'google-map-react';
import Geolocation from '../../../models/geolocation';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { Avatar } from 'antd';

interface ResultMapProps {
  searchLocation: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
  onResultLocationClicked?: (
    location: ProviderLocationWithAvailability
  ) => void;
}

type MarkerProps = Geolocation & {
  $hover?: boolean;
};

interface IconMarkerProps extends MarkerProps {
  isHighlighted: boolean;
  resultIdentifier: string;
  providerLocation: ProviderLocationWithAvailability;
}

const IconMarker = ({
  isHighlighted,
  resultIdentifier,
}: IconMarkerProps): JSX.Element => {
  return (
    <Avatar
      size={'small'}
      style={{
        backgroundColor: isHighlighted ? 'purple' : 'black',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {resultIdentifier}
    </Avatar>
  );
};

// https://github.com/google-map-react/google-map-react/blob/master/API.md
export default function ResultMap({
  searchLocation,
  resultLocations,
  selectedLocationId,
  onResultLocationClicked,
}: ResultMapProps): JSX.Element {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const defaultCenter: Geolocation = searchLocation;
  const defaultZoom = 11;
  const currentCenter: Geolocation | undefined = resultLocations.find(
    (loc) => loc.id === selectedLocationId
  )?.location;

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: apiKey }}
      center={currentCenter}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onChildClick={(key, childProps: IconMarkerProps) => {
        onResultLocationClicked?.(childProps.providerLocation);
      }}
    >
      {resultLocations.map((loc, index) => {
        return (
          <IconMarker
            lat={loc.location.lat}
            lng={loc.location.lng}
            isHighlighted={loc.id === selectedLocationId}
            key={loc.id}
            resultIdentifier={(index + 1).toFixed(0)}
            providerLocation={loc}
          />
        );
      })}
    </GoogleMapReact>
  );
}
