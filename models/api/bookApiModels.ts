import { UnregisteredPatient } from '../patient';
import { BookingRequestSlot } from '../booking';

export interface BookingApiRequestInputData {
  providerLocationId: string;
  // Timeslot
  timeSlot: BookingRequestSlot;
  // Patient info
  patient: UnregisteredPatient;
  reason: string;
}

export interface BookingApiResponse {
  appointmentId: string;
}
