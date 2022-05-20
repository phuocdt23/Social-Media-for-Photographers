import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Album } from '../../albums/entities/album.entity';
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
  @ManyToOne(() => User, (user) => user.photos)
  user: User;
  @ManyToOne(() => Album, (album) => album.photos)
  album: Album;
}
