import { Course, Level, Status } from '../../entity/Course';
import { User, UserRole } from '../../entity/User';
import { MainContext } from '../../types/MainContext';
import { verifyToken } from '../../utils/verifiyToken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { CreateCoruseInput } from './course/CreateCourseInput';
import { UpdateCoruseInput } from './course/UpdateCourseInput';

@Resolver()
export class CourseResolver {
  @Mutation(() => Course)
  async createCourse(
    @Arg('data')
    { image, duration, level, title }: CreateCoruseInput,
    @Ctx() ctx: MainContext
  ): Promise<Course> {
    //   check if the user has access
    const user: User = await verifyToken(ctx.req);

    // verifiy the role
    if (user.role === UserRole.STUDENT)
      throw new Error("Students cant't create courses ");

    if (!Level[level])
      throw new Error(
        `Please select valid level (${Level.BEGINNER}, ${Level.INTERMEDIATE}, ${Level.ADDVANCED})`
      );

    const newCourse = await Course.create({
      title,
      instructor: user,
      image,
      duration,
      level: Level[level],
    }).save();

    return newCourse;
  }

  @Mutation(() => Boolean)
  // @note => only the admin or the owner can delete the course
  async deleteCourse(
    @Arg('courseId') courseId: string,
    @Ctx() ctx: MainContext
  ) {
    const user = await verifyToken(ctx.req);

    const course = await Course.findOne(courseId);

    if (!course) throw new Error('Course not found');

    if (course.instructor.id !== user.id && user.role !== UserRole.ADMIN)
      throw new Error(
        'Unauthorized to delete the course, Only the admin or the owner'
      );

    await Course.delete(courseId);

    return true;
  }

  // get all couses that only accepted by the admin
  @Query(() => [Course])
  async getCourses(): Promise<Course[]> {
    const couses = await Course.find({
      where: {
        status: Status.ACCEPTED,
      },
      relations: ['instructor'],
    });

    return couses;
  }
  // accept the course
  @Mutation(() => Boolean)
  async acceptOrRejectCouse(
    @Arg('courseId') courseId: string,
    @Arg('status') status: Status,
    @Ctx() ctx: MainContext
  ) {
    //  check if the user login or not
    const user = await verifyToken(ctx.req);
    // check if the user provide valid status
    if (!Status[status])
      throw new Error(
        `Please provide a on of these ${Status.ACCEPTED} or ${Status.REJECTED}`
      );

    // check if the user is admin
    if (user.role !== UserRole.ADMIN)
      throw new Error('Unauthorized to accept courses');
    // check if the course exist
    const course = await Course.findOne(courseId);
    if (!course) throw new Error('Coruse Not found');

    // updatge course status
    course.status = status;
    course.save();
    return true;
  }

  // update course only the owner
  @Mutation(() => Course)
  async updateCourse(
    @Arg('data') { courseId, duration, title, image, level }: UpdateCoruseInput,
    @Ctx() ctx: MainContext
  ) {
    const user = verifyToken(ctx.req);

    const course = await Course.find({
      relations: ['instructor'],
      where: {
        id: courseId,
      },
    });

    if (!course) throw new Error('Coures not found');
  }
}
