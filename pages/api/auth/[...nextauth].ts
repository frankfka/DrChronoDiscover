import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import type {NextApiRequest, NextApiResponse} from 'next';
import Adapters from 'next-auth/adapters';
import User, {UserSchema} from '../../../models/User';

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    {
      type: 'mongodb',
      useNewUrlParser: true,
      url: process.env.MONGO_CONNECTION_STRING,
      ssl: true,
      useUnifiedTopology: true,
      authSource: "admin",
    },
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: {
          model: User,
          schema: UserSchema,
        },
      },
    }
  ),
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body)
  return NextAuth(req, res, options);
};
