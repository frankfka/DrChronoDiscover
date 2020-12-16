import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const appServices = await getAppServices();
  const result = await appServices.bookingService.testFn(req.query);
  res.status(200).json({
    data: result,
  });
};
