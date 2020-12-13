import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';
import {
  NearbyApiQueryParams,
  NearbyApiResponse,
} from '../../models/api/nearbyApiModels';
import { createGeolocation } from '../../models/geolocation';

function parseNearbyRequest(
  req: NextApiRequest
): NearbyApiQueryParams | undefined {
  // TODO: Validation
  return (req.query as unknown) as NearbyApiQueryParams;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<NearbyApiResponse>
) => {
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }
  const queryParams = parseNearbyRequest(req);
  if (!queryParams) {
    res.status(400);
    return;
  }
  const appServices = await getAppServices();
  const locations = await appServices.mongooseClient.searchForNearbyProviderLocations(
    createGeolocation(queryParams.lat, queryParams.lng),
    queryParams.maxDistance
  );
  res.status(200).json({
    locations,
  });
};
