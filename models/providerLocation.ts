import Geolocation from './geolocation';

export default interface ProviderLocation {
  id: string;
  providerId: string;
  name: string;
  officeId: number;
  location: Geolocation;
}

export function createProviderLocation(
  id: string,
  providerId: string,
  name: string,
  officeId: number,
  location: Geolocation
): ProviderLocation {
  return {
    id,
    providerId,
    name,
    officeId,
    location,
  };
}
