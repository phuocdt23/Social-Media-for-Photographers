import { Photo } from '../../photos/entities/photo.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Like' })
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes, { eager: true })
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.likes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  photo: Photo;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;
}
