import Geolocation from './geolocation';

export default interface ProviderLocation {
  providerId: string;
  name: string;
  officeId: number;
  location: Geolocation;
}

export function createProviderLocation(
  providerId: string,
  name: string,
  officeId: number,
  location: Geolocation
): ProviderLocation {
  return {
    providerId,
    name,
    officeId,
    location,
  };
}
