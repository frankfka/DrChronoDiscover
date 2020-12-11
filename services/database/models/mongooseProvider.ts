import * as mongoose from 'mongoose';

// Chrono API
export interface MongooseProviderChronoApiInfo extends mongoose.Document {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiry: Date;
}
export const mongooseChronoApiInfoSchema = new mongoose.Schema({
  refreshToken: String,
  accessToken: String,
  accessTokenExpiry: Date,
});

// Provider
export interface MongooseProviderDocument extends mongoose.Document {
  name: string;
  chronoApiInfo: MongooseProviderChronoApiInfo;
}
export const mongooseProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chronoApiInfo: {
      type: mongooseChronoApiInfoSchema,
      required: true,
    },
  },
  {
    collection: 'providers',
  }
);

// Models
export const MongooseProvider =
  mongoose.models.Provider || // Enables hot reload to not recreate the model
  mongoose.model<MongooseProviderDocument>('Provider', mongooseProviderSchema);
