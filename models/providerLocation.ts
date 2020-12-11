import Geolocation from './geolocation';

export default interface ProviderLocation {
  providerId: string;
  name: string;
  location: Geolocation;
}

export function createProviderLocation(
  providerId: string,
  name: string,
  location: Geolocation
): ProviderLocation {
  return {
    providerId,
    name,
    location,
  };
}
