/* eslint-disable prettier/prettier */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  // import { Comment } from '../comment/comment.entity';
  import { User } from '../../users/entities/user.entity';
  import { Post } from '../../posts/entities/post.entity';
  @Entity({ name: 'Comment' })
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @ApiProperty()
    @Column({ nullable: false })
    content: string;
  
    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;
  
    @ManyToOne(() => User, (user) => user.posts)
    user: User;
  }
  