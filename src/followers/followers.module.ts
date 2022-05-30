import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './entities/follower.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follower, User])],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
