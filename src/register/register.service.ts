import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { IUser } from './../users/interface/users.interface';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) { }

  public async register(registerUserDto: RegisterUserDto): Promise<IUser | string> {
    const userbyEmail = await this.usersService.findByEmail(registerUserDto.email);
    const userbyUsername = await this.usersService.findByUsername(registerUserDto.username);

    if (userbyEmail) return `existingEmail`;
    if (userbyUsername) return `existingUsername`;

    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 8);
    const payload = {
      username: registerUserDto.username,
      email: registerUserDto.email
    };
    const confirmToken = this.jwtService.sign(payload);
    const link = `localhost:3000/auth/register/${confirmToken}`;
    this.sendMailConfirm(registerUserDto, link);

    return this.usersService.create(registerUserDto);
  }

  private sendMailConfirm(user, link): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Confirm registation',
        text: 'Confirm registation!',
        template: 'index',
        context: {
          title: 'Confirm registationly',
          link,
          description:
            `In order to complete registation please click Confirm`,
          nameUser: user.name,
        },
      })
      .then((response) => {
        console.log(response);
        console.log('User Registration: Send Mail Confirmation successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Registration: Send Mail Confirmation Failed!');
      });
  }
  // private sendMailConfirmation(user, token): void {
  //   this.mailerService
  //     .sendMail({
  //       to: user.email,
  //       from: 'from@example.com',
  //       subject: 'Registration successful ✔',
  //       text: 'Registration successful!',
  //       template: 'index',
  //       context: {
  //         title: 'Registration successfully',
  //         description:
  //           "You did it! You registered!, You're successfully registered.✔",
  //         nameUser: user.name,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       console.log('User Registration: Send Mail successfully!');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       console.log('User Registration: Send Mail Failed!');
  //     });
  // }
}
