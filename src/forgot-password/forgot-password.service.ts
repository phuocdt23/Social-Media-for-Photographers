import { MailerService } from '../mailer/mailer.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}
  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        email: forgotPasswordDto.email,
      });
      if (!user) {
        return new NotFoundException('That email does not have an account');
      }
      const passwordRandom = Math.random().toString(36).slice(-8);
      user.password = bcrypt.hashSync(passwordRandom, 8);
      this.sendMailForgotPassword(forgotPasswordDto.email, passwordRandom);
      return {
        response: {
          message: `Your new password has sent to your mail!`,
          statusCode: 201,
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  private sendMailForgotPassword(email, password): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        template: 'index',
        context: {
          title: 'Forgot Password successful!',
          description:
            'Request Reset Password Successfully!  ✔, This is your new password: ' +
            password,
        },
      })
      .catch((err) => {
        console.log(err);
        console.log('Forgot Password: Send Mail Failed!');
      });
  }
}
