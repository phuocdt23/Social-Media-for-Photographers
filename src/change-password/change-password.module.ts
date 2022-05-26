import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

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
  controllers: [ChangePasswordController],
  providers: [ChangePasswordService, ],//UsersService
})
export class ChangePasswordModule {}
