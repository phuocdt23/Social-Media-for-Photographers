import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { CommentsModule } from './comments/comments.module';
import { FollowersModule } from './followers/followers.module';
import { PhotosModule } from './photos/photos.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AlbumsModule,
    CommentsModule,
    FollowersModule,
    PhotosModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
