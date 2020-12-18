import { Interval } from 'luxon';

export interface Appointment {
  id: string;
  doctorId: number;
  examRoomId: number;
  officeId: number;
  patientId: number;
  reason: string;
  scheduledTimeInterval: Interval;
}
