import MongooseDatabaseClient from '../database/mongooseDatabaseClient';
import ChronoClient from '../chronoClient/chronoClient';
import Provider from '../../models/provider';
import { ChronoClientAuthentication } from '../chronoClient/models/chronoAuthentication';

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

  private getChronoClientAuthentication(
    provider: Provider
  ): ChronoClientAuthentication {
    return {
      chronoApiInfo: provider.chronoApiInfo,
      onAccessTokenRefresh: async (
        newAccessToken: string,
        newAccessTokenExpiry: Date
      ) => {
        await this.onAccessTokenRefresh(
          provider.providerId,
          newAccessToken,
          newAccessTokenExpiry
        );
      },
    };
  }

  private async onAccessTokenRefresh(
    providerId: string,
    newAccessToken: string,
    newAccessTokenExpiry: Date
  ): Promise<void> {
    await this.db.updateProviderAuthentication(
      providerId,
      newAccessToken,
      newAccessTokenExpiry
    );
    console.log(
      'Updated provider authentication in Database for provider',
      providerId
    );
  }
}
