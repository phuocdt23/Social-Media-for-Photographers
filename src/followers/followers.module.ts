import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './entities/follower.entity';
import { UsersModule } from '../users/users.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follower]),
    forwardRef(() => UsersModule),
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
