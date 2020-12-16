import Geolocation from './geolocation';

export default interface ProviderLocation {
  providerId: string;
  name: string;
  officeId: string;
  location: Geolocation;
}

export function createProviderLocation(
  providerId: string,
  name: string,
  officeId: string,
  location: Geolocation
): ProviderLocation {
  return {
    providerId,
    name,
    officeId,
    location,
  };
}
