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
import { QueryFunctionContext } from 'react-query/types/core/types';

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

export type GetNearbyProviderLocationsParams = {
  location: Geolocation;
  maxDistance: number;
};

export async function getNearbyProviderLocations({
  queryKey,
}: QueryFunctionContext<
  [string, GetNearbyProviderLocationsParams]
>): Promise<NearbyApiResponse> {
  const params = queryKey[1];
  const queryParams: NearbyApiQueryParams = {
    ...params.location,
    maxDistance: params.maxDistance,
  };
  const response = await axios.get('/api/nearby', {
    params: queryParams,
  });
  if (response.status !== 200) {
    throw Error(`Incorrect status code from nearby request ${response.status}`);
  }
  return response.data as NearbyApiResponse;
}

export type GetProviderLocationAvailableTimesParams = {
  providerLocations: Array<ProviderLocation>;
  isoSearchDate: string;
  targetDurationMinutes: number;
};

export async function getProviderLocationAvailableTimes({
  queryKey,
}: QueryFunctionContext<
  [string, GetProviderLocationAvailableTimesParams]
>): Promise<AvailableTimesApiResponse> {
  const params = queryKey[1];
  const queryParams: AvailableTimesApiQueryParams = {
    locationIds: params.providerLocations.map((loc) => loc.id).join(','), // Comma separated list of ID's
    targetDuration: params.targetDurationMinutes,
    isoDate: params.isoSearchDate,
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
