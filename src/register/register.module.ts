import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { MailerModule } from '../mailer/mailer.module';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule],
  controllers: [RegisterController],
  providers: [RegisterService, UsersService]
})
export class RegisterModule { }
