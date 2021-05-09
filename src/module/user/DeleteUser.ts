import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole } from '../../entity/User';
import { MainContext } from '../../types/MainContext';
import { verifyToken } from '../../utils/verifiyToken';
@Resolver(User)
class deleteUserResolver {
  @Mutation(() => Boolean, {
    nullable: true,
  })
  async deleteUser(
    @Arg('userId') userId: string,
    @Ctx() ctx: MainContext
  ): Promise<boolean> {
    const user: User = (await verifyToken(ctx.req)) as User;

    // check if the user has access
    if (user.role !== UserRole.ADMIN)
      throw new Error('Unauthorized to delete users');

    // check if deletedUser exist
    const isExist = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!isExist) throw new Error('User not found');

    await User.delete({ id: userId as any });

    return true;
  }
}

export default deleteUserResolver;
