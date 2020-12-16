import { ChronoApiInfo } from '../../../models/provider';

export interface ChronoClientAuthentication {
  chronoApiInfo: ChronoApiInfo;
  onAccessTokenRefresh: (
    newAccessToken: string,
    newAccessTokenExpiry: Date,
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
