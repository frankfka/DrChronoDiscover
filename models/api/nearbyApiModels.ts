import Geolocation from '../geolocation';
import ProviderLocation from '../providerLocation';

export type NearbyApiQueryParams = Geolocation & {
  maxDistance: number;
};

export interface NearbyApiResponse {
  locations: Array<ProviderLocation>;
}
