import * as mongoose from 'mongoose';
import Geolocation from '../../../models/geolocation';

// https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722

// Location - [lng, lat]
export interface MongooseLocationDocument extends mongoose.Document {
  coordinates: Array<number>;
}
export const mongooseLocationSchema = new mongoose.Schema({
  coordinates: [Number],
});

// Provider Location
export interface MongooseProviderLocationDocument extends mongoose.Document {
  providerId: string;
  name: string;
  location: MongooseLocationDocument;
}
export const mongooseProviderLocationSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: mongooseLocationSchema,
      required: true,
    },
  },
  {
    collection: 'providerLocations',
  }
);
// Provider Location static methods
async function findNear(
  this: mongoose.Model<MongooseProviderLocationDocument>,
  location: Geolocation,
  maxDistance: number
): Promise<Array<MongooseProviderLocationDocument>> {
  return this.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [location.lng, location.lat] },
        $maxDistance: maxDistance,
      },
    },
  });
}
mongooseProviderLocationSchema.statics.findNear = findNear;

// Model
export interface MongooseProviderLocationModel
  extends mongoose.Model<MongooseProviderLocationDocument> {
  // Find near function
  findNear: (
    this: mongoose.Model<MongooseProviderLocationDocument>,
    location: Geolocation,
    maxDistance: number
  ) => Promise<Array<MongooseProviderLocationDocument>>;
}
export const MongooseProviderLocation: MongooseProviderLocationModel =
  (mongoose.models.ProviderLocation as MongooseProviderLocationModel) || // Enables hot reload to not recreate the model
  mongoose.model<
    MongooseProviderLocationDocument,
    MongooseProviderLocationModel
  >('ProviderLocation', mongooseProviderLocationSchema);
