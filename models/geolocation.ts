export default interface Geolocation {
  lat: number;
  lng: number;
}

export function createGeolocation(lat: number, lng: number): Geolocation {
  return {
    lat,
    lng,
  };
}
