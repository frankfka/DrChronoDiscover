export interface ChronoApiInfo {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiry: Date;
  clientId: string;
  clientSecret: string;
}

export function createChronoApiInfo(
  refreshToken: string,
  accessToken: string,
  accessTokenExpiry: Date,
  clientId: string,
  clientSecret: string
): ChronoApiInfo {
  return {
    refreshToken,
    accessToken,
    accessTokenExpiry,
    clientId,
    clientSecret,
  };
}

export default interface Provider {
  providerId: string;
  name: string;
  chronoApiInfo: ChronoApiInfo;
}

export function createProvider(
  providerId: string,
  name: string,
  chronoApiInfo: ChronoApiInfo
): Provider {
  return {
    providerId,
    name,
    chronoApiInfo,
  };
}
