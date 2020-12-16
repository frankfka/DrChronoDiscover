import axios, { AxiosRequestConfig, Method } from 'axios';
import { DateTime, Duration } from 'luxon';
import applyCaseMiddleware from 'axios-case-converter';
import {
  ChronoAuthenticationParams,
  ChronoAuthRefreshData,
} from './models/chronoAuthentication';
import ChronoOfficeData from './models/chronoOffice';

export default class ChronoClient {
  private static AUTH_EXPIRY_LIMIT_SECONDS = 10;

  private readonly endpoint: string;
  private readonly axiosClient;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosClient = applyCaseMiddleware(axios.create()); // Convert camelCase to snake_case & vice versa
  }

  async getOfficeInfo(
    officeId: string,
    authParams: ChronoAuthenticationParams
  ): Promise<ChronoOfficeData> {
    return this.executeGet<ChronoOfficeData>(
      '/api/offices/' + officeId,
      authParams
    );
  }

  /**
   * @param date - Will retrieve all appointments for this date, formatted as YYYY-MM-DD
   * @param officeId - Retrieves for this office only
   */
  async getOfficeAppointments(date: Date, officeId: string) {
    // TODO (remember to to make page_size = 100 or something)
  }

  async createPatient(
    gender: 'Male' | 'Female',
    firstName: string,
    lastName: string,
    doctorId: string
  ) {
    // TODO
  }

  async createAppointment(
    doctorId: string,
    patientId: string,
    officeId: string,
    examRoomId: string,
    duration: string, // In Minutes
    scheduledTime: Date // TODO consider DateTime
  ) {
    // TODO
  }

  /**
   * Helper functions to execute requests
   */
  private async executeGet<T>(
    path: string,
    authParams: ChronoAuthenticationParams,
    params?: Record<string, unknown>
  ): Promise<T> {
    return this.executeRequest(path, 'GET', authParams, undefined, params);
  }

  private async executePost<T>(
    path: string,
    authParams: ChronoAuthenticationParams,
    data?: Record<string, unknown>
  ): Promise<T> {
    return this.executeRequest(path, 'POST', authParams, data);
  }

  private async executeRequest<T>(
    path: string,
    method: Method,
    authParams: ChronoAuthenticationParams,
    data?: Record<string, unknown>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const bearerToken = await this.getOrRefreshAuth(authParams);
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
    if (response.status !== 200 || !response.data) {
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
    authParams: ChronoAuthenticationParams
  ): Promise<string> {
    // Get expiry
    const expiryDateTime = DateTime.fromJSDate(
      authParams.chronoApiInfo.accessTokenExpiry
    );
    // Determine whether we need refresh
    if (
      expiryDateTime.diffNow().as('seconds') <
      ChronoClient.AUTH_EXPIRY_LIMIT_SECONDS
    ) {
      return this.refreshAuthAndNotify(authParams);
    } else {
      // Return the current token as it is still valid
      return authParams.chronoApiInfo.accessToken;
    }
  }

  private async refreshAuthAndNotify(
    authParams: ChronoAuthenticationParams
  ): Promise<string> {
    // Refresh token data to be passed in as params
    const data = {
      refresh_token: authParams.chronoApiInfo.refreshToken,
      grant_type: 'refresh_token',
      client_id: authParams.chronoApiInfo.clientId,
      client_secret: authParams.chronoApiInfo.clientSecret,
      scope:
        'patients:read patients:write user:read user:write calendar:read calendar:write clinical:read clinical:write',
    };
    // Execute POST
    const response = await this.axiosClient.request<ChronoAuthRefreshData>({
      method: 'POST',
      url: this.endpoint + '/o/token/',
      params: data,
    });
    if (response.status !== 200 || !response.data) {
      throw Error(
        `Error while refreshing authentication: ${JSON.stringify(response)}`
      );
    }
    // Execute callback to notify of result
    const newExpiryDate = DateTime.local().plus(
      Duration.fromMillis(response.data.expiresIn * 1000)
    );
    authParams.onAccessTokenRefresh(
      response.data.accessToken,
      newExpiryDate.toJSDate(),
      response.data.refreshToken
    );
    return response.data.accessToken;
  }
}
