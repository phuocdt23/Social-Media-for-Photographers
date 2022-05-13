import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../../albums/entities/album.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'User_Album' })
export class UserAlbum {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.albums)
  user: User;

  @ManyToOne(() => Album, (album) => album.users)
  album: Album;
}
