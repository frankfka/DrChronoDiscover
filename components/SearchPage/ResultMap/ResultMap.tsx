import GoogleMapReact from 'google-map-react';
import Geolocation from '../../../models/geolocation';
import { ProviderLocationWithAvailability } from '../searchPageModels';
import { Avatar, Spin } from 'antd';
import { BiCurrentLocation } from 'react-icons/bi';

interface ResultMapProps {
  searchLocation?: Geolocation;
  resultLocations: Array<ProviderLocationWithAvailability>;
  selectedLocationId: string | undefined;
  loading?: boolean;
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
        backgroundColor: isHighlighted ? '#ff3a4c' : '#4f7395',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {resultIdentifier}
    </Avatar>
  );
};

type CurrentLocationMarkerProps = MarkerProps;

// eslint-disable-next-line no-empty-pattern
const CurrentLocationMarker = ({}: CurrentLocationMarkerProps): JSX.Element => {
  return (
    <BiCurrentLocation
      size={'24px'}
      style={{
        color: '#ff3a4c',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

// https://github.com/google-map-react/google-map-react/blob/master/API.md
export default function ResultMap({
  loading,
  searchLocation,
  resultLocations,
  selectedLocationId,
  onResultLocationClicked,
}: ResultMapProps): JSX.Element {
  if (loading || !searchLocation) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin />
      </div>
    );
  }
  const defaultZoom = 11;
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const defaultCenter: Geolocation = searchLocation;
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
        if (childProps.providerLocation) {
          onResultLocationClicked?.(childProps.providerLocation);
        }
      }}
    >
      {/*Current Location*/}
      <CurrentLocationMarker
        lat={searchLocation.lat}
        lng={searchLocation.lng}
      />
      {/*Results*/}
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
