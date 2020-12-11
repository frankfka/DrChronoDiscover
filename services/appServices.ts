import MongooseDatabaseClient from './database/mongooseDatabaseClient';

interface AppServices {
  mongooseClient: MongooseDatabaseClient;
}

// Create all app services
let appServices: AppServices | undefined;
async function initServices(): Promise<AppServices> {
  // Mongoose
  const mongooseClient = new MongooseDatabaseClient(
    process.env.MONGO_CONNECTION_STRING!
  );
  await mongooseClient.connect();
  console.log('Mongoose client is initialized');

  appServices = {
    mongooseClient,
  };
  return appServices;
}

// Async getter
export default async function getAppServices(): Promise<AppServices> {
  if (appServices) {
    return appServices;
  }
  return initServices();
}
