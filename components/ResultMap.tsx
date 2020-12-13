import GoogleMapReact from 'google-map-react';
import Geolocation from '../models/geolocation';
import ProviderLocation from '../models/providerLocation';

interface ResultMapProps {
  searchLocation: Geolocation;
  resultLocations: Array<ProviderLocation>;
  selectedIndex: number | undefined;
  onResultLocationClicked?: (location: ProviderLocation) => void;
}

type MarkerProps = Geolocation;

interface TextMarkerProps extends MarkerProps {
  providerLocation: ProviderLocation;
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
  selectedIndex,
  onResultLocationClicked,
}: ResultMapProps): JSX.Element {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const defaultCenter: Geolocation = searchLocation;
  const defaultZoom = 11;
  let currentCenter: Geolocation | undefined;
  if (selectedIndex !== undefined) {
    currentCenter = resultLocations[selectedIndex].location;
  }

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: apiKey }}
      center={currentCenter}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onChildClick={(key, childProps: TextMarkerProps) => {
        // TODO: Temporarily using key as index here
        onResultLocationClicked?.(childProps.providerLocation);
      }}
    >
      {resultLocations.map((loc, index) => {
        return (
          <TextMarker
            lat={loc.location.lat}
            lng={loc.location.lng}
            providerLocation={loc}
            isSelected={index === selectedIndex}
            key={index}
          />
        );
      })}
    </GoogleMapReact>
  );
}
