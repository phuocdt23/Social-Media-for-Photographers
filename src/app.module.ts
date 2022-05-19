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
import { RegisterModule } from './register/register.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { ChangePasswordModule } from './change-password/change-password.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AlbumsModule,
    CommentsModule,
    FollowersModule,
    PhotosModule,
    PostsModule,
    RegisterModule,
    MailerModule,
    LoginModule,
    ChangePasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
