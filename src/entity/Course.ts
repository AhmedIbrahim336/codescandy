import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

export enum Level {
  BEGINNER = 'BEGINNER',
  ADDVANCED = 'ADDVANCED',
  INTERMEDIATE = 'INTERMEDIATE',
}
export enum Status {
  NONE = 'NONE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.courses)
  instructor: User;

  @Field()
  @Column()
  image: string;

  // duration of the course by minutes
  @Field()
  @Column()
  duration: number;

  @Field()
  @Column({
    type: 'enum',
    enum: Level,
    nullable: false,
  })
  level: Level;

  @Field()
  @Column({
    type: 'numeric',
    default: 0,
  })
  rating: number;

  @Field()
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.NONE,
  })
  status: Status;

  @Field()
  @Column('text', {
    default: new Date(),
  })
  date: string;
}
