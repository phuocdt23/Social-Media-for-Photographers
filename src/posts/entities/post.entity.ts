/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
@Entity({ name: 'Post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column({ nullable: false })
  content: string;

  @ApiProperty()
  @Column({ nullable: false, default: 0 })
  like: number;

  @ApiProperty()
  @Column({ nullable: false, default: 0 })
  dislike: number;

  @ApiProperty()
  @Column({ default: true })
  isPublic: boolean;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
