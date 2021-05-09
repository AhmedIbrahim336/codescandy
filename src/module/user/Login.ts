import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import LoginInput from './login/LoginInput';
import { MainContext } from '../../types/MainContext';
import { getToken } from '../../utils/getToken';
@Resolver(User)
class LoginResolver {
  @Mutation(() => User, {
    nullable: true,
  })
  async login(
    @Arg('data') { password, email }: LoginInput,
    @Ctx() ctx: MainContext
  ): Promise<User | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // Validation
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    user.token = getToken(user.id);

    return user;
  }
}

export default LoginResolver;
