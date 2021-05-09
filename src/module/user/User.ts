import { User } from '../../entity/User';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers() {
    const users = await User.find({
      relations: ['courses'],
    });

    return users;
  }
}
