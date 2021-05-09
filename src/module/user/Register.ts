import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { getToken } from '../../utils/getToken';
@Resolver(User)
class RegisterResolver {
  @Query(() => String)
  async health() {
    return 'healthy';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { username, password, email }: RegisterInput
  ): Promise<User> {
    //   hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const isExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isExist) throw new Error('User Aready Exist');

    //  create the user
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      courses: [],
    }).save();

    user.token = getToken(user.id);

    return user;
  }
}

export default RegisterResolver;
