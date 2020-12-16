export interface ChronoExamRoomData {
  index: number; // Use this as the ID
  name: string;
  onlineScheduling: boolean;
}

export default interface ChronoOfficeData {
  id: string;
  name: string;
  doctor: string;
  examRooms: Array<ChronoExamRoomData>;
  startTime: string; // '09:00:00'
  endTime: string; // '18:00:00'
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  onlineScheduling: boolean;
  phoneNumber?: string;
}
