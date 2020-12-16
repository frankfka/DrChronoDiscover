import MongooseDatabaseClient from './database/mongooseDatabaseClient';
import ChronoClient from './chronoClient/chronoClient';
import BookingService from './bookingService/bookingService';

interface AppServices {
  mongooseClient: MongooseDatabaseClient;
  chronoClient: ChronoClient;
  bookingService: BookingService;
}

// Create all app services
let appServices: AppServices | undefined;
async function initServices(): Promise<AppServices> {
  // Mongoose
  const mongooseClient = new MongooseDatabaseClient(
    process.env.MONGO_CONNECTION_STRING!
  );
  await mongooseClient.connect();

  // Chrono API
  const chronoClient = new ChronoClient(process.env.CHRONO_API_ENDPOINT!);

  // Booking
  const bookingService = new BookingService(mongooseClient, chronoClient);

  appServices = {
    mongooseClient,
    chronoClient,
    bookingService,
  };
  console.log('Initialized app services');
  return appServices;
}

// Async getter
export default async function getAppServices(): Promise<AppServices> {
  if (appServices) {
    return appServices;
  }
  return initServices();
}
