import Geolocation, { createGeolocation } from '../../models/geolocation';
import {
  NearbyApiQueryParams,
  NearbyApiResponse,
} from '../../models/api/nearbyApiModels';
import axios from 'axios';
import ProviderLocation from '../../models/providerLocation';
import {
  AvailableTimesApiQueryParams,
  AvailableTimesApiResponse,
} from '../../models/api/availableTimesApiModels';

export async function getCurrentLocation(): Promise<Geolocation> {
  const currentPosition = await new Promise<GeolocationPosition>(
    (resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
  );
  return createGeolocation(
    currentPosition.coords.latitude,
    currentPosition.coords.longitude
  );
}

export async function getNearbyProviderLocations(
  key: string, // React-Query key
  location: Geolocation,
  maxDistance = 30000 // 30km default
): Promise<NearbyApiResponse> {
  const queryParams: NearbyApiQueryParams = {
    ...location,
    maxDistance: maxDistance,
  };
  const response = await axios.get('/api/nearby', {
    params: queryParams,
  });
  if (response.status !== 200) {
    throw Error(`Incorrect status code from nearby request ${response.status}`);
  }
  return response.data as NearbyApiResponse;
}

export async function getProviderLocationAvailableTimes(
  key: string, // React-Query key
  providerLocations: Array<ProviderLocation>,
  isoSearchDate: string,
  targetDurationMinutes = 30
): Promise<AvailableTimesApiResponse> {
  const queryParams: AvailableTimesApiQueryParams = {
    locationIds: providerLocations.map((loc) => loc.id).join(','), // Comma separated list of ID's
    targetDuration: targetDurationMinutes,
    isoDate: isoSearchDate,
  };
  const response = await axios.get('/api/availableTimes', {
    params: queryParams,
  });
  if (response.status !== 200) {
    throw Error(
      `Incorrect status code from available times request ${response.status}`
    );
  }
  return response.data as AvailableTimesApiResponse;
}
