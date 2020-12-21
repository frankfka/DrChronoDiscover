import GoogleMapReact from 'google-map-react';
import Geolocation from '../../../models/geolocation';
import { ProviderLocationWithAvailability } from '../searchPageModels';

interface ResultMapProps {
  searchLocation: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
  onResultLocationClicked?: (
    location: ProviderLocationWithAvailability
  ) => void;
}

type MarkerProps = Geolocation;

interface TextMarkerProps extends MarkerProps {
  providerLocation: ProviderLocationWithAvailability;
  isSelected: boolean;
}

const TextMarker = ({
  providerLocation,
  isSelected,
}: TextMarkerProps): JSX.Element => {
  return (
    <div
      style={{
        width: 100,
        height: 25,
        backgroundColor: isSelected ? 'purple' : 'black',
        color: 'white',
      }}
    >
      <p>{providerLocation.name}</p>
    </div>
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
      onChildClick={(key, childProps: TextMarkerProps) => {
        onResultLocationClicked?.(childProps.providerLocation);
      }}
    >
      {resultLocations.map((loc) => {
        return (
          <TextMarker
            lat={loc.location.lat}
            lng={loc.location.lng}
            providerLocation={loc}
            isSelected={loc.id === selectedLocationId}
            key={loc.id}
          />
        );
      })}
    </GoogleMapReact>
  );
}
