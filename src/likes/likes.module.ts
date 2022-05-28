import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/photos/entities/photo.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
@Module({
  imports: [TypeOrmModule.forFeature([Like, Photo, User])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
