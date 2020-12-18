export type ChronoPatientGender = 'Male' | 'Female';

export interface ChronoCreatePatientParams {
  gender: ChronoPatientGender;
  firstName: string;
  lastName: string;
  doctor: number;
}
