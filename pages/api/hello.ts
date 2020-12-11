import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';

type Data = {
  name: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const appServices = await getAppServices();
  const result = await appServices.mongooseClient.searchForNearbyProviderLocations(
    {
      lat: 49.1441398,
      lng: -123.165502,
    },
    10000
  );
  console.log(result);
  res.status(200).json({ name: 'John Doe' });
};
