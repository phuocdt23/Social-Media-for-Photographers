import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { IUser } from './../users/interface/users.interface';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    registerUserDto: RegisterUserDto,
  ): Promise<IUser | string> {
    const userByEmail = await this.usersService.findByEmail(
      registerUserDto.email,
    );
    const userByUsername = await this.usersService.findByUsername(
      registerUserDto.username,
    );

    if (userByEmail) return `existingEmail`;
    if (userByUsername) return `existingUsername`;

    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 8);
    const payload = {
      email: registerUserDto.email,
    };
    const confirmToken = this.jwtService.sign(payload);
    console.log(confirmToken);
    const link = `localhost:3000/auth/register/${confirmToken}`;
    this.sendMailConfirm(registerUserDto, link);

    return this.usersService.create(registerUserDto);
  }

  private sendMailConfirm(user, link): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Confirm registration',
        text: 'Confirm registration!',
        template: 'index',
        context: {
          title: 'Confirm registration',
          link,
          description: `In order to complete registration please click Confirm`,
          nameUser: user.name,
        },
      })
      .then(() => {
        console.log('User Registration: Send Mail Confirmation successfully!');
      })
      .catch(() => {
        console.log('User Registration: Send Mail Confirmation Failed!');
      });
  }
  public async confirmEmailRegistration(token: string): Promise<any> {
    const { email } = this.jwtService.verify(token);
    const user = await this.usersService.findByEmail(email);
    user.isConfirmed = true;
    this.sendMailRegisterSuccessfully(user);
    return await this.userRepository.save(user);
  }

  private sendMailRegisterSuccessfully(user): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.name,
        },
      })
      .then((response) => {
        console.log(response);
        console.log('User Registration: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Registration: Send Mail Failed!');
      });
  }
}
