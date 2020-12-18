import type { NextApiRequest, NextApiResponse } from 'next';
import getAppServices from '../../services/appServices';
import {
  AvailableTimesApiQueryParams,
  AvailableTimesApiResponse,
  AvailableTimeslot,
} from '../../models/api/availableTimesApiModels';
import { DateTime } from 'luxon';
import { AvailableBookingSlot } from '../../models/availableBookingSlot';

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
    requestedDate: DateTime.fromISO(queryParams.isoDate).set({
      hour: 0,
      minute: 0,
      second: 0,
    }),
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
          // TODO: extract helper functions for these
          isoStartTime: slot.interval.start.toISO({
            suppressMilliseconds: true,
            suppressSeconds: true,
            includeOffset: false,
          }),
          duration: slot.interval.toDuration('minutes').as('minutes'),
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
