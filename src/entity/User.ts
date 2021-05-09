import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './Course';

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Field(() => [Course])
  @OneToMany(() => Course, course => course.instructor)
  courses: Course[];

  @Field({
    nullable: true,
  })
  token: string;
}
