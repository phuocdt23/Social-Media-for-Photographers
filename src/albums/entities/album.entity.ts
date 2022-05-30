import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Photo } from '../../photos/entities/photo.entity';
import { User } from '../../users/entities/user.entity';
enum Status {
  Public = 'Public',
  Private = 'Private',
}
@Entity({ name: 'Album' })
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  ownerId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Public,
  })
  status: Status;

  @CreateDateColumn({ name: 'Created_At', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'Updated_At', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[];
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
