import { ChronoApiInfo } from '../../../models/provider';

export interface ChronoAuthRefreshData {
  accessToken: string;
  refreshToken: string;
  scope: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface ChronoAuthenticationParams {
  chronoApiInfo: ChronoApiInfo;
  onAccessTokenRefresh: (
    newAccessToken: string,
    newAccessTokenExpiry: Date,
    newRefreshToken: string
  ) => void;
}
