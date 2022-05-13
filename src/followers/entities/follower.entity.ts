/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
// import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'Follower' })
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'followerId' })
  followerId!: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'User_Follower' })
  user: User;
}

