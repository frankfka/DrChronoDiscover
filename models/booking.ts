import { Interval } from 'luxon';

export interface AvailableBookingSlot {
  doctorId: number;
  examRoomId: number;
  interval: Interval;
}

export interface BookingRequestSlot
  extends Omit<AvailableBookingSlot, 'interval'> {
  durationInMinutes: number;
  scheduledISOTime: string;
}

export interface BookingRequestPatient {
  patientId: number;
}

export interface BookingRequest
  extends BookingRequestSlot,
    BookingRequestPatient {
  officeId: number;
  reason: string;
}
