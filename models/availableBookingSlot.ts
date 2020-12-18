import { Interval } from 'luxon';

export interface AvailableBookingSlot {
  doctorId: number;
  examRoomId: number;
  interval: Interval;
}
