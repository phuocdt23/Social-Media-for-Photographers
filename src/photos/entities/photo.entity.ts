import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Album } from '../../albums/entities/album.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
@Entity({ name: 'Photo' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  link: string;

  @ApiProperty()
  @Column({ default: true })
  isPublic: boolean;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @ManyToOne(() => Album, (album) => album.photos, { onDelete: 'CASCADE' })
  album: Album;

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.photo)
  likes: Like[];
}
