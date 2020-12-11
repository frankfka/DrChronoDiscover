import * as mongoose from 'mongoose';

export default class MongoDatabaseClient {
  private static DB_NAME = 'dev';

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

  async geoSearchForProviderLocations(lat: number, long: number) {
    console.log('%d %d', lat, long);
  }

  async getProviderById(providerId: string) {
    console.log(providerId);
  }
}
