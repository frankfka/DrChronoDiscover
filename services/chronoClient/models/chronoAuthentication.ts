import { ChronoApiInfo } from '../../../models/provider';
import { DateTime } from 'luxon';

export interface ChronoClientAuthentication {
  chronoApiInfo: ChronoApiInfo;
  onAccessTokenRefresh: (
    newAccessToken: string,
    newAccessTokenExpiry: DateTime,
    newRefreshToken: string
  ) => void;
}

export interface ChronoRefreshAuthenticationData {
  accessToken: string;
  refreshToken: string;
  scope: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
