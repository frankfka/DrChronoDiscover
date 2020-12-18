import MongooseDatabaseClient from '../database/mongooseDatabaseClient';
import ChronoClient from '../chronoClient/chronoClient';
import Provider from '../../models/provider';
import { ChronoClientAuthentication } from '../chronoClient/models/chronoAuthentication';
import { AvailableBookingSlot, BookingRequestSlot } from '../../models/booking';
import ChronoOfficeData from '../chronoClient/models/chronoOffice';
import { DateTime, Duration, Interval } from 'luxon';
import { fromChronoDateTimeString } from '../chronoClient/chronoClientDateUtils';
import { Appointment } from '../../models/appointment';
import { UnregisteredPatient } from '../../models/patient';
import ProviderLocation from '../../models/providerLocation';

export default class BookingService {
  private readonly db: MongooseDatabaseClient;
  private readonly chronoClient: ChronoClient;

  constructor(mongooseDb: MongooseDatabaseClient, chronoClient: ChronoClient) {
    this.db = mongooseDb;
    this.chronoClient = chronoClient;
  }

  async testFn(args: Record<string, unknown>): Promise<unknown> {
    return {};
  }

  async createAppointment(
    providerLocationId: string,
    patientData: UnregisteredPatient,
    timeslotData: BookingRequestSlot,
    reason = ''
  ): Promise<Appointment | undefined> {
    // Look up provider location
    const providerInfo = await this.getLocationAndProviderByLocationId(
      providerLocationId
    );
    if (providerInfo == null) {
      return undefined;
    }
    const [providerLocation, parentProvider] = providerInfo;
    // Create the patient
    const registeredPatient = await this.chronoClient.createPatient(
      patientData,
      this.getChronoClientAuthentication(parentProvider)
    );
    // Make the appointment
    const appointment = await this.chronoClient.createAppointment(
      {
        doctorId: timeslotData.doctorId,
        durationInMinutes: timeslotData.durationInMinutes,
        examRoomId: timeslotData.examRoomId,
        officeId: providerLocation.officeId,
        patientId: registeredPatient.id,
        reason: reason,
        scheduledISOTime: timeslotData.scheduledISOTime,
      },
      this.getChronoClientAuthentication(parentProvider)
    );
    console.log('Created appointment with ID', appointment.id);
    return appointment;
  }

  /*
  Returns a list of booking slots for a given date, with the given target duration
   */
  async getAvailableBookingTimesForDate(
    date: DateTime,
    providerLocationId: string,
    targetDurationInMinutes: number
  ): Promise<Array<AvailableBookingSlot>> {
    // Get all available slots
    const allAvailableSlots = await this.getAllAvailableSlotsForDate(
      date,
      providerLocationId
    );
    const targetDuration = Duration.fromMillis(
      targetDurationInMinutes * 60 * 1000
    );

    // Process into valid slots
    const validBookingSlotsWithTargetDuration: Array<AvailableBookingSlot> = [];
    allAvailableSlots.forEach((slot) => {
      // Assume we don't need to round to the nearest 15min/half hour/full hour, etc
      // So we can just split this into intervals of the desired length
      validBookingSlotsWithTargetDuration.push(
        ...slot.interval
          .splitBy(targetDuration)
          .filter((interval) => interval.toDuration().equals(targetDuration))
          .map((interval) => {
            return {
              doctorId: slot.doctorId,
              examRoomId: slot.examRoomId,
              interval,
            };
          })
      );
    });
    return validBookingSlotsWithTargetDuration;
  }

  /*
  Get ALL available timeslots, regardless of length
   */
  private async getAllAvailableSlotsForDate(
    date: DateTime,
    providerLocationId: string
  ): Promise<Array<AvailableBookingSlot>> {
    /*
    API/DB calls
     */
    // Get the provider location
    const providerInfo = await this.getLocationAndProviderByLocationId(
      providerLocationId
    );
    if (providerInfo == null) {
      return [];
    }
    const [providerLocation, parentProvider] = providerInfo;
    // Get info on office
    const providerLocationOfficeInfo: ChronoOfficeData = await this.chronoClient.getOfficeInfo(
      providerLocation.officeId,
      this.getChronoClientAuthentication(parentProvider)
    );
    // Get appointments
    const appointmentsForDate: Array<Appointment> = await this.chronoClient.getOfficeAppointments(
      date,
      providerLocation.officeId,
      this.getChronoClientAuthentication(parentProvider)
    );

    // Get office hours (for the requested date) - make a function so we can call this without cloning
    const getOfficeHours = (): Interval =>
      Interval.fromDateTimes(
        fromChronoDateTimeString(providerLocationOfficeInfo.startTime).set({
          day: date.day,
          month: date.month,
          year: date.year,
        }),
        fromChronoDateTimeString(providerLocationOfficeInfo.endTime).set({
          day: date.day,
          month: date.month,
          year: date.year,
        })
      );

    // Get doctors (only use the owner for now)
    const doctorIds: Array<number> = [providerLocationOfficeInfo.doctor];
    // Get exam rooms
    const examRoomIds: Array<number> = providerLocationOfficeInfo.examRooms.map(
      (room) => room.index
    );

    /*
    Availability calculations
     */
    // Map of doctors to appointment slots
    const doctorIdToAppointmentTimeIntervals: Map<
      number,
      Array<Interval>
    > = new Map(doctorIds.map((id) => [id, []]));
    // Map of examRoomIds to appointment slots
    const examRoomIdToAppointmentTimeIntervals = new Map<
      number,
      Array<Interval>
    >(examRoomIds.map((id) => [id, []]));
    // Process all the appointments, assigning them to the correct examRoomId & doctorId
    appointmentsForDate.forEach((appointment: Appointment) => {
      // Process for doctor
      doctorIdToAppointmentTimeIntervals
        .get(appointment.doctorId)
        ?.push(appointment.scheduledTimeInterval);
      // Process for exam room
      examRoomIdToAppointmentTimeIntervals
        .get(appointment.examRoomId)
        ?.push(appointment.scheduledTimeInterval);
    });
    // Map of doctor to available timeslots
    const doctorIdToAvailabilities = new Map<number, Array<Interval>>(
      Array.from(doctorIdToAppointmentTimeIntervals.entries()).map(
        ([doctorId, appointments]) => {
          return [doctorId, getOfficeHours().difference(...appointments)];
        }
      )
    );
    // Map of exam room to available timeslots
    const examRoomIdToAvailabilities = new Map<number, Array<Interval>>(
      Array.from(examRoomIdToAppointmentTimeIntervals.entries()).map(
        ([examRoomId, appointments]) => {
          return [examRoomId, getOfficeHours().difference(...appointments)];
        }
      )
    );
    // Calculate availabilities
    const availableBookingSlots: Array<AvailableBookingSlot> = [];
    const examRoomAvailabilityEntries = Array.from(
      examRoomIdToAvailabilities.entries()
    );
    const doctorIdAvailabilityEntries = Array.from(
      doctorIdToAvailabilities.entries()
    );

    doctorIdAvailabilityEntries.forEach(([doctorId, availabilities]) => {
      availabilities.forEach((doctorAvailability) => {
        // Check exam rooms and get intersection - we want to find the exam room with the greatest intersection
        let maxIntersectionExamRoomId: number | undefined = undefined;
        let maxIntersectionInterval: Interval | undefined = undefined;
        examRoomAvailabilityEntries.forEach(
          ([examRoomId, examRoomAvailabilities]) => {
            examRoomAvailabilities.forEach((examRoomAvailability) => {
              const availabilityIntersection = doctorAvailability.intersection(
                examRoomAvailability
              );
              if (
                // We have an interval but this one is larger
                (availabilityIntersection &&
                  maxIntersectionInterval &&
                  availabilityIntersection.engulfs(maxIntersectionInterval)) ||
                // Or - if we found an intersection and haven't had a previous interval
                (!maxIntersectionInterval && availabilityIntersection)
              ) {
                // Update
                maxIntersectionInterval = availabilityIntersection;
                maxIntersectionExamRoomId = examRoomId;
              }
            });
          }
        );
        // If we've found some sort of intersection, add it to the booking slots
        if (
          maxIntersectionInterval != null &&
          maxIntersectionExamRoomId != null
        ) {
          availableBookingSlots.push({
            doctorId: doctorId,
            examRoomId: maxIntersectionExamRoomId,
            interval: maxIntersectionInterval,
          });
        }
      });
    });

    return availableBookingSlots;
  }

  private async getLocationAndProviderByLocationId(
    providerLocationId: string
  ): Promise<[ProviderLocation, Provider] | undefined> {
    const providerLocation = await this.db.getProviderLocationById(
      providerLocationId
    );
    if (providerLocation == null) {
      console.error(
        'Could not find providerLocation with ID',
        providerLocationId
      );
      return undefined;
    }
    // Get the parent provider
    const parentProvider = await this.db.getProviderById(
      providerLocation.providerId
    );
    if (parentProvider == null) {
      console.error(
        'Could not find provider for provider location',
        providerLocation
      );
      return undefined;
    }
    return [providerLocation, parentProvider];
  }

  private getChronoClientAuthentication(
    provider: Provider
  ): ChronoClientAuthentication {
    return {
      chronoApiInfo: provider.chronoApiInfo,
      onAccessTokenRefresh: (
        newAccessToken: string,
        newAccessTokenExpiry: DateTime
      ) => {
        // Update the provider itself, as it is passed by reference, we should have the new access in subsequent calls
        provider.chronoApiInfo = {
          ...provider.chronoApiInfo,
          accessToken: newAccessToken,
          accessTokenExpiry: newAccessTokenExpiry,
        };
        // Update the DB
        this.updateDatabaseProviderAuthentication(
          provider.providerId,
          newAccessToken,
          newAccessTokenExpiry
        );
      },
    };
  }

  /**
   * Function to update MongoDB authentication values
   */
  private updateDatabaseProviderAuthentication(
    providerId: string,
    newAccessToken: string,
    newAccessTokenExpiry: DateTime
  ): void {
    this.db
      .updateProviderAuthentication(
        providerId,
        newAccessToken,
        newAccessTokenExpiry
      )
      .then(() => {
        console.log(
          'Updated provider authentication in Database for provider',
          providerId
        );
      });
  }
}
