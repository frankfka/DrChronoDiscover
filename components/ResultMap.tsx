import GoogleMapReact from 'google-map-react';
import Geolocation from '../models/Location';
import {FC} from 'react';

interface MapProps {
  currentLocation: Geolocation
  resultLocations: Array<Geolocation>
  selectedIndex: number
}

interface MarkerProps extends Geolocation {

}

interface TextMarkerProps extends MarkerProps {
  text: string
  isSelected: boolean
}

const TextMarker = ({ text, isSelected }: TextMarkerProps) => {
  return (
    <div style={{
      width: 25,
      height: 25,
      backgroundColor: isSelected ? 'purple' : 'black',
      color: 'white'
    }}>
      <p>
        {text}
      </p>
    </div>
  );
};


// https://github.com/google-map-react/google-map-react/blob/master/API.md
export const ResultMap: FC<MapProps> = ({currentLocation, resultLocations, selectedIndex}) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  return (
    <GoogleMapReact
      bootstrapURLKeys={{key: apiKey}}
      center={currentLocation}
      defaultCenter={{
        lat: 49.2827,
        lng: 123.1207,
      }}
      defaultZoom={12}
    >
      {
        resultLocations.map((loc, index) => {
          return (
            <TextMarker
              lat={loc.lat} lng={loc.lng}
              text={`${index}`} isSelected={index === selectedIndex}
              key={index}
            />
          );
        })
      }
    </GoogleMapReact>
  );
};
