import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('SECRET_KEY_JWT'),
    //     signOptions: {
    //       expiresIn: 3600,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [LoginController],
  providers: [LoginService, ],//UsersService
})
export class LoginModule {}
