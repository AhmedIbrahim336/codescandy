import { Field, InputType } from 'type-graphql';
import { Level } from '../../../entity/Course';

@InputType()
export class UpdateCoruseInput {
  @Field()
  courseId: string;
  
  @Field()
  title?: string;

  @Field()
  image?: string;
  // duration of the course by minutes
  @Field()
  duration?: number;

  @Field()
  level?: Level;
}
