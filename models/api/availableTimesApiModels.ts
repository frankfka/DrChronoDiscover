export type AvailableTimesApiQueryParams = {
  locationIds: string;
  targetDuration: number;
  isoDate: string;
};

export interface AvailableTimeslot {
  doctorId: number;
  examRoomId: number;
  isoStartTime: string;
  duration: number;
}

export interface AvailableTimesApiResponse {
  availableBookingTimesByLocationId: Record<string, Array<AvailableTimeslot>>;
}
