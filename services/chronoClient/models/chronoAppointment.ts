import { Appointment } from '../../../models/appointment';
import { Duration, Interval } from 'luxon';
import { fromChronoDateTimeString } from '../chronoClientDateUtils';

export interface ChronoCreateAppointmentParams {
  doctor: number;
  examRoom: number;
  scheduledTime: string; // ex.  '2020-12-18T14:30'
  patient: number;
  office: number;
  duration: number;
  reason: string;
}

export interface ChronoAppointmentData {
  doctor: number;
  duration: number;
  examRoom: number;
  office: number;
  patient: number;
  reason: string;
  scheduledTime: string; // ex. '2020-12-07T09:00:00'
}

export function convertChronoAppointmentToAppointment(
  chronoAppointment: ChronoAppointmentData
): Appointment {
  const startTime = fromChronoDateTimeString(chronoAppointment.scheduledTime);
  return {
    doctorId: chronoAppointment.doctor,
    examRoomId: chronoAppointment.examRoom,
    officeId: chronoAppointment.office,
    patientId: chronoAppointment.patient,
    reason: chronoAppointment.reason,
    scheduledTimeInterval: Interval.after(
      startTime,
      Duration.fromMillis(chronoAppointment.duration * 60 * 1000) // Chrono duration is in minutes
    ),
  };
}

export interface ChronoGetAppointmentsParams {
  date: string; // ex. 2020-12-07
  office: number;
  pageSize: number;
}

export interface ChronoGetAppointmentsData {
  previous: string | null;
  next: string | null;
  results: Array<ChronoAppointmentData>;
}
