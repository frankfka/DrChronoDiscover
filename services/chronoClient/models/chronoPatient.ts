export type ChronoPatientGender = 'Male' | 'Female';

export interface ChronoCreatePatientParams {
  gender: ChronoPatientGender;
  firstName: string;
  lastName: string;
  doctor: number;
}

export type ChronoCreatePatientData = ChronoCreatePatientParams & {
  id: number;
};
