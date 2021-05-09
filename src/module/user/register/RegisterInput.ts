import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Length(3, 255)
  @Field()
  username: string;

  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}
