import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { CommentsModule } from './comments/comments.module';
import { FollowersModule } from './followers/followers.module';
import { PhotosModule } from './photos/photos.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtVerifyMiddleware } from './middlewares/jwt-verify.middleware';
import { JwtModule } from '@nestjs/jwt';
import { LikesModule } from './likes/likes.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AlbumsModule,
    CommentsModule,
    FollowersModule,
    PhotosModule,
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY_JWT'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtVerifyMiddleware)
      .exclude({
        path: 'albums/handleInviation/:token',
        method: RequestMethod.GET,
      })
      .forRoutes(
        'albums',
        'photos',
        'comments',
        'likes',

        { path: 'users/change-password', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.PUT },
        { path: 'users', method: RequestMethod.GET },
      );
  }
}
