/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from '../../photos/entities/photo.entity';
import { UserAlbum } from '../../user_album/entities/user_album.entity';
@Entity({ name: 'Album' })
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false})
  name: string;

  @ApiProperty()
  @Column({ nullable: false})
  description: string;

  @ApiProperty()
  @Column({ default: true })
  isPublic: boolean;

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];

  @OneToMany(() => UserAlbum, (user_album) => user_album.album)
  users: UserAlbum[];
}
