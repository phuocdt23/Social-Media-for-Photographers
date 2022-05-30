import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosModule } from 'src/photos/photos.module';
import { UsersModule } from 'src/users/users.module';
import { Like } from './entities/like.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
@Module({
  imports: [TypeOrmModule.forFeature([Like]), PhotosModule, UsersModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
