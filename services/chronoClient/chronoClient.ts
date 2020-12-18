import axios, { AxiosRequestConfig, Method } from 'axios';
import { DateTime, Duration } from 'luxon';
import applyCaseMiddleware from 'axios-case-converter';
import {
  ChronoClientAuthentication,
  ChronoRefreshAuthenticationData,
} from './models/chronoAuthentication';
import ChronoOfficeData from './models/chronoOffice';
import {
  ChronoAppointmentData,
  ChronoCreateAppointmentParams,
  ChronoGetAppointmentsData,
  ChronoGetAppointmentsParams,
  convertChronoAppointmentToAppointment,
} from './models/chronoAppointment';
import { Appointment } from '../../models/appointment';
import { toChronoDateString } from './chronoClientDateUtils';
import { ChronoCreatePatientData } from './models/chronoPatient';
import { Patient, UnregisteredPatient } from '../../models/patient';
import { BookingRequest } from '../../models/booking';

export default class ChronoClient {
  private static AUTH_EXPIRY_LIMIT_SECONDS = 10;

  private readonly endpoint: string;
  private readonly axiosClient;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosClient = applyCaseMiddleware(axios.create()); // Convert camelCase to snake_case & vice versa
  }

  async getOfficeInfo(
    officeId: number,
    authentication: ChronoClientAuthentication
  ): Promise<ChronoOfficeData> {
    return this.executeGet<ChronoOfficeData>(
      '/api/offices/' + officeId.toString(),
      authentication
    );
  }

  /*
   * date - Will retrieve all appointments for this date, formatted as YYYY-MM-DD
   * officeId - Retrieves for this office only
   */
  async getOfficeAppointments(
    date: DateTime,
    officeId: number,
    authentication: ChronoClientAuthentication
  ): Promise<Array<Appointment>> {
    const params: ChronoGetAppointmentsParams = {
      date: toChronoDateString(date),
      office: officeId,
      pageSize: 100,
    };
    const getAppointmentsData = await this.executeGet<ChronoGetAppointmentsData>(
      '/api/appointments',
      authentication,
      params
    );
    return getAppointmentsData.results.map(
      convertChronoAppointmentToAppointment
    );
  }

  async createPatient(
    patientData: UnregisteredPatient,
    doctorId: number,
    authentication: ChronoClientAuthentication
  ): Promise<Patient> {
    const createPatientResult = await this.executePost<ChronoCreatePatientData>(
      '/api/patients',
      authentication,
      {
        ...patientData,
        doctor: doctorId,
      }
    );
    console.log('Create patient success', createPatientResult);
    return createPatientResult; // Interfaces for Patient and ChronoCreatePatientData are the same
  }

  async createAppointment(
    request: BookingRequest,
    authentication: ChronoClientAuthentication
  ): Promise<Appointment> {
    const appointmentData: ChronoCreateAppointmentParams = {
      doctor: request.doctorId,
      examRoom: request.examRoomId,
      scheduledTime: request.scheduledISOTime,
      patient: request.patientId,
      office: request.officeId,
      duration: request.durationInMinutes,
      reason: request.reason,
    };
    const createAppointmentResult = await this.executePost<ChronoAppointmentData>(
      '/api/appointments',
      authentication,
      appointmentData
    );
    console.log('Create appointment success', createAppointmentResult);
    return convertChronoAppointmentToAppointment(createAppointmentResult);
  }

  /**
   * Helper functions to execute requests
   */
  private async executeGet<T>(
    path: string,
    authentication: ChronoClientAuthentication,
    params?: unknown
  ): Promise<T> {
    return this.executeRequest(path, 'GET', authentication, undefined, params);
  }

  private async executePost<T>(
    path: string,
    authentication: ChronoClientAuthentication,
    data?: unknown
  ): Promise<T> {
    return this.executeRequest(path, 'POST', authentication, data);
  }

  private async executeRequest<T>(
    path: string,
    method: Method,
    authentication: ChronoClientAuthentication,
    data?: unknown,
    params?: unknown
  ): Promise<T> {
    const bearerToken = await this.getOrRefreshAuth(authentication);
    const requestConfig: AxiosRequestConfig = {
      method: method,
      url: this.endpoint + path,
      params: params,
      data: data,
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    };
    console.debug('Executing Request', requestConfig);
    const response = await this.axiosClient.request<T>(requestConfig);
    if (response.status < 200 || response.status > 299 || !response.data) {
      throw Error(
        `Error while executing response: ${JSON.stringify(response)}`
      );
    }
    return response.data;
  }

  /**
   * Fetches a valid access token to include as a Bearer header
   * TODO: This does not consider timezones - should also consider adding a `force` param to refresh on 401
   */
  private async getOrRefreshAuth(
    authentication: ChronoClientAuthentication
  ): Promise<string> {
    // Get expiry
    const expiryDateTime = authentication.chronoApiInfo.accessTokenExpiry;
    // Determine whether we need refresh
    if (
      expiryDateTime.diffNow().as('seconds') <
      ChronoClient.AUTH_EXPIRY_LIMIT_SECONDS
    ) {
      return this.refreshAuthAndNotify(authentication);
    } else {
      // Return the current token as it is still valid
      return authentication.chronoApiInfo.accessToken;
    }
  }

  private async refreshAuthAndNotify(
    authentication: ChronoClientAuthentication
  ): Promise<string> {
    // Refresh token data to be passed in as params
    const data = {
      refresh_token: authentication.chronoApiInfo.refreshToken,
      grant_type: 'refresh_token',
      client_id: authentication.chronoApiInfo.clientId,
      client_secret: authentication.chronoApiInfo.clientSecret,
      scope:
        'patients:read patients:write user:read user:write calendar:read calendar:write clinical:read clinical:write',
    };
    // Execute POST
    const response = await this.axiosClient.request<ChronoRefreshAuthenticationData>(
      {
        method: 'POST',
        url: this.endpoint + '/o/token/',
        params: data,
      }
    );
    if (response.status < 200 || response.status > 299 || !response.data) {
      throw Error(
        `Error while refreshing authentication: ${JSON.stringify(response)}`
      );
    }
    // Execute callback to notify of result
    const newExpiryDate = DateTime.local().plus(
      Duration.fromMillis(response.data.expiresIn * 1000)
    );
    authentication.onAccessTokenRefresh(
      response.data.accessToken,
      newExpiryDate,
      response.data.refreshToken
    );
    return response.data.accessToken;
  }
}
