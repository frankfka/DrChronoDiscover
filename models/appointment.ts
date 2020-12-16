import { DateTime } from 'luxon';

export interface Appointment {
  doctorId: string;
  durationInMinutes: number;
  examRoomId: string;
  officeId: string;
  patientId: string;
  reason: string;
  scheduledTime: DateTime;
}
