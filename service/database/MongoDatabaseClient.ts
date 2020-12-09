import { MongoClient } from 'typeorm';

export default class MongoDatabaseClient {
  // TODO: Env vars?
  private static DB_NAME = 'dev';

  private connectionUri: string;
  private client: MongoClient;

  constructor(connectionUri: string) {
    this.connectionUri = connectionUri;
    this.client = new MongoClient(connectionUri);
  }

  async connect() {
    await this.client.connect();
    // Establish and verify connection
    await this.client.db(MongoDatabaseClient.DB_NAME).command({ ping: 1 });
    console.log('Connected successfully to MongoDB');
  }

  async disconnect() {
    await this.client.close();
  }

  async geoSearchForProviderLocations(lat: number, long: number) {
    console.log('%d %d', lat, long);
  }

  async getProviderById(providerId: string) {
    console.log(providerId);
  }
}
