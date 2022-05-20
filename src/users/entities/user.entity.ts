import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from '../../photos/entities/photo.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
// import { Follower } from '../../followers/entities/follower.entity';
@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user001' })
  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @ApiProperty({ example: 'user1' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'user001@gmail.com' })
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({ example: '123123' })
  @Column({ nullable: false })
  password: string;

  @ApiProperty()
  @Column({
    nullable: false,
    default: false,
  })
  isConfirmed: boolean;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
