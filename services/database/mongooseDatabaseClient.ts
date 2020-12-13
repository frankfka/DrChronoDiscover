import * as mongoose from 'mongoose';
import { MongooseProviderLocation } from './models/mongooseProviderLocation';
import ProviderLocation, {
  createProviderLocation,
} from '../../models/providerLocation';
import Geolocation, { createGeolocation } from '../../models/geolocation';
import Provider, {
  createChronoApiInfo,
  createProvider,
} from '../../models/provider';
import { MongooseProvider } from './models/mongooseProvider';

export default class MongooseDatabaseClient {
  private readonly connectionUri: string;

  constructor(connectionUri: string) {
    this.connectionUri = connectionUri;
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  async searchForNearbyProviderLocations(
    location: Geolocation,
    maxDistance: number
  ): Promise<Array<ProviderLocation>> {
    const mongooseProviderLocations = await MongooseProviderLocation.findNear(
      location,
      maxDistance
    );
    return mongooseProviderLocations.map((mongooseModel) => {
      return createProviderLocation(
        mongooseModel.providerId,
        mongooseModel.name,
        createGeolocation(
          mongooseModel.location.coordinates[1],
          mongooseModel.location.coordinates[0]
        )
      );
    });
  }

  async getProviderById(providerId: string): Promise<Provider | undefined> {
    const mongooseProvider = await MongooseProvider.findById(providerId);
    return mongooseProvider
      ? createProvider(
          mongooseProvider.id!,
          mongooseProvider.name,
          createChronoApiInfo(
            mongooseProvider.chronoApiInfo.refreshToken,
            mongooseProvider.chronoApiInfo.accessToken,
            mongooseProvider.chronoApiInfo.accessTokenExpiry
          )
        )
      : undefined;
  }
}