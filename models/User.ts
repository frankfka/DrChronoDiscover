import Adapters from 'next-auth/adapters';
import { EntitySchema } from 'typeorm';

export default class User extends Adapters.TypeORM.Models.User.model {
  phoneNumber?: string;

  constructor(
    name?: string,
    email?: string,
    image?: string,
    emailVerified?: Date
  ) {
    super(name, email, image, emailVerified);
  }
}

export const UserSchema: EntitySchema<User>['options'] = {
  name: 'User',
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    // Adds a phoneNumber to the User schema
    phoneNumber: {
      type: 'string',
      nullable: true,
      default: 'hello',
    },
  },
};
