import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';
import {
  AvailableTimesApiQueryParams,
  AvailableTimesApiResponse,
  AvailableTimeslot,
} from '../../models/api/availableTimesApiModels';
import { DateTime } from 'luxon';
import {
  dateTimeFromISO,
  dateTimeToISO,
  intervalToDurationInMinutes,
} from '../../utils/dateUtils';

interface AvailableTimesQuery {
  locationIds: Array<string>;
  targetDuration: number;
  requestedDate: DateTime;
}

function parseAvailableTimesRequest(
  req: NextApiRequest
): AvailableTimesQuery | undefined {
  const queryParams = (req.query as unknown) as AvailableTimesApiQueryParams;
  return {
    locationIds: queryParams.locationIds.split(','),
    targetDuration: queryParams.targetDuration,
    requestedDate: dateTimeFromISO(queryParams.isoDate, true),
  };
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<AvailableTimesApiResponse>
) => {
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }
  const queryParams = parseAvailableTimesRequest(req);
  if (!queryParams) {
    res.status(400);
    return;
  }
  const appServices = await getAppServices();
  const providerLocationIdToAvailableSlots: Map<
    string,
    Array<AvailableTimeslot>
  > = new Map();
  for (const locationId of queryParams.locationIds) {
    const availableSlots = await appServices.bookingService.getAvailableBookingTimesForDate(
      queryParams.requestedDate,
      locationId,
      queryParams.targetDuration
    );
    providerLocationIdToAvailableSlots.set(
      locationId,
      availableSlots.map((slot) => {
        return {
          doctorId: slot.doctorId,
          examRoomId: slot.examRoomId,
          isoStartTime: dateTimeToISO(slot.interval.start),
          duration: intervalToDurationInMinutes(slot.interval),
        };
      })
    );
  }
  res.status(200).json({
    availableBookingTimesByLocationId: Object.fromEntries(
      providerLocationIdToAvailableSlots
    ),
  });
};
