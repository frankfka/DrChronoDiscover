import GoogleMapReact from 'google-map-react';
import Geolocation from '../models/Location';

interface ResultMapProps {
  currentLocation: Geolocation;
  resultLocations: Array<Geolocation>;
  selectedIndex: number | undefined;
}

type MarkerProps = Geolocation;

interface TextMarkerProps extends MarkerProps {
  text: string;
  isSelected: boolean;
}

const TextMarker = ({ text, isSelected }: TextMarkerProps) => {
  return (
    <div
      style={{
        width: 25,
        height: 25,
        backgroundColor: isSelected ? 'purple' : 'black',
        color: 'white',
      }}
    >
      <p>{text}</p>
    </div>
  );
};

// https://github.com/google-map-react/google-map-react/blob/master/API.md
export default function ResultMap({
  currentLocation,
  resultLocations,
  selectedIndex,
}: ResultMapProps) {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const defaultCenter: Geolocation = currentLocation;
  const defaultZoom = 11;
  let currentCenter: Geolocation | undefined;
  if (selectedIndex !== undefined) {
    currentCenter = resultLocations[selectedIndex];
  }

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: apiKey }}
      center={currentCenter}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onChildClick={(key, childProps) => {
        console.log('Child clicked', key, childProps);
      }}
    >
      {resultLocations.map((loc, index) => {
        return (
          <TextMarker
            lat={loc.lat}
            lng={loc.lng}
            text={`${index}`}
            isSelected={index === selectedIndex}
            key={index}
          />
        );
      })}
    </GoogleMapReact>
  );
}
