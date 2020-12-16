import { Appointment } from '../../../models/appointment';
import { DateTime } from 'luxon';
import { fromChronoDateTimeString } from '../chronoClientDateUtils';

export interface ChronoCreateAppointmentParams {
  doctor: string;
  examRoom: string;
  scheduledTime: string; // ex.  '2020-12-18T14:30'
  patient: string;
  office: string;
  duration: number;
  reason: string;
}

export interface ChronoAppointmentData {
  doctor: string;
  duration: number;
  examRoom: string;
  office: string;
  patient: string;
  reason: string;
  scheduledTime: string; // ex. '2020-12-07T09:00:00'
}

export function convertChronoAppointmentToAppointment(
  chronoAppointment: ChronoAppointmentData
): Appointment {
  return {
    doctorId: chronoAppointment.doctor,
    durationInMinutes: chronoAppointment.duration,
    examRoomId: chronoAppointment.examRoom,
    officeId: chronoAppointment.office,
    patientId: chronoAppointment.patient,
    reason: chronoAppointment.reason,
    scheduledTime: fromChronoDateTimeString(chronoAppointment.scheduledTime),
  };
}

export interface ChronoGetAppointmentsParams {
  date: string; // ex. 2020-12-07
  office: string;
  pageSize: number;
}

export interface ChronoGetAppointmentsData {
  previous: string | null;
  next: string | null;
  results: Array<ChronoAppointmentData>;
}
