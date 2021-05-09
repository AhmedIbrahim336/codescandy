import { Field, InputType } from 'type-graphql';
import { Level } from '../../../entity/Course';

@InputType()
export class UpdateCoruseInput {
  @Field()
  courseId: string;

  @Field({
    nullable: true,
  })
  title?: string;

  @Field({
    nullable: true,
  })
  image?: string;
  // duration of the course by minutes
  @Field({
    nullable: true,
  })
  duration?: number;

  @Field({
    nullable: true,
  })
  level?: Level;
}
