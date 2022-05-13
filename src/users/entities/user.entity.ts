import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from '../../photos/entities/photo.entity';
import { UserAlbum } from '../../user_album/entities/user_album.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
// import { Follower } from '../../followers/entities/follower.entity';
@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty()
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

  @OneToMany(() => UserAlbum, (user_album) => user_album.user)
  albums: UserAlbum[];
}
