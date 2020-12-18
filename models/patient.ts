export type Gender = 'Male' | 'Female';

export type UnregisteredPatient = Omit<Patient, 'id'>;

export interface Patient {
  id: number;
  gender: Gender;
  firstName: string;
  lastName: string;
  doctor: number;
}
