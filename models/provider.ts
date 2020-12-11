export interface ChronoApiInfo {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiry: Date;
}

export function createChronoApiInfo(
  refreshToken: string,
  accessToken: string,
  accessTokenExpiry: Date
): ChronoApiInfo {
  return {
    refreshToken,
    accessToken,
    accessTokenExpiry,
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
