import ProviderLocation from '../../models/providerLocation';
import {
  MutationKey,
  QueryFunctionContext,
} from 'react-query/types/core/types';
import {
  AvailableTimesApiQueryParams,
  AvailableTimesApiResponse,
} from '../../models/api/availableTimesApiModels';
import axios from 'axios';
import {
  BookingApiRequestInputData,
  BookingApiResponse,
} from '../../models/api/bookApiModels';
import { UnregisteredPatient } from '../../models/patient';
import { BookingRequestSlot } from '../../models/booking';
import { BookingFormValues } from './BookingModal/BookingForm/BookingForm';
import { ProviderLocationWithAvailability } from './searchPageModels';

export type BookAppointmentParams = {
  bookingFormValues: BookingFormValues;
  locationWithAvailabilities: ProviderLocationWithAvailability;
};

export async function bookAppointment(
  params: BookAppointmentParams
): Promise<BookingApiResponse> {
  const bookingFormValues = params.bookingFormValues;
  const timeslotForBooking =
    params.locationWithAvailabilities.availableSlots[
      bookingFormValues.selectedTimeslotIndex
    ];
  // TODO: Use phone + email
  const unregisteredPatient: UnregisteredPatient = {
    gender: 'Male',
    firstName: bookingFormValues.firstName,
    lastName: bookingFormValues.lastName,
  };
  const timeSlot: BookingRequestSlot = {
    doctorId: timeslotForBooking.doctorId,
    examRoomId: timeslotForBooking.examRoomId,
    durationInMinutes: timeslotForBooking.duration,
    scheduledISOTime: timeslotForBooking.isoStartTime,
  };
  const mutationData: BookingApiRequestInputData = {
    patient: unregisteredPatient,
    providerLocationId: params.locationWithAvailabilities.id,
    reason: bookingFormValues.visitReason,
    timeSlot: timeSlot,
  };
  const response = await axios.post('/api/book', mutationData);
  if (response.status !== 200) {
    throw Error(
      `Incorrect status code from create appointment request ${response.status}`
    );
  }
  return response.data as BookingApiResponse;
}
