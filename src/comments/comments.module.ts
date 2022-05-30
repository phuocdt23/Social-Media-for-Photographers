import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Photo])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
