import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';
import {
  BookingApiRequestInputData,
  BookingApiResponse,
} from '../../models/api/bookApiModels';
function parseBookingRequest(
  req: NextApiRequest
): BookingApiRequestInputData | undefined {
  // TODO: Validation
  return (req.body as unknown) as BookingApiRequestInputData;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<BookingApiResponse>
) => {
  if (req.method !== 'POST') {
    res.status(400).end();
    return;
  }
  const data = parseBookingRequest(req);
  if (!data) {
    res.status(400).end();
    return;
  }
  const appServices = await getAppServices();
  const appointment = await appServices.bookingService.createAppointment(
    data.providerLocationId,
    data.patient,
    data.timeSlot,
    data.reason
  );
  if (appointment == null) {
    // Unsuccessful
    res.status(500).end();
    return;
  }
  res.status(200).json({
    appointmentId: appointment.id,
  });
};
