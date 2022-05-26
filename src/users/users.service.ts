import { Injectable, HttpException, HttpStatus, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  public async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.save(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  public async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }
  public async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ id: id });
      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.username = updateUserDto.username;

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  public async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user: User
  ): Promise<User> {
    try {
      // const user = await this.userRepository.findOne({ user.email });
      const passwordIsValid = bcrypt.compareSync(updatePasswordDto.currentPassword, user.password);

      if (!passwordIsValid == true) {
        throw new HttpException('Invalid Current Password', HttpStatus.BAD_REQUEST);
      }

      if (updatePasswordDto.currentPassword === updatePasswordDto.newPassword) {
        throw new HttpException('Your new pasword cannot be same as your old password!', HttpStatus.BAD_REQUEST);
      }

      user.password = bcrypt.hashSync(updatePasswordDto.newPassword, 8);
      return await this.userRepository.save(user);
    } catch (err) {
      throw err;
    }
  }
  // for register account
  public async register(
    createUserDto: CreateUserDto,
  ) {
    try {
      const userByEmail = await this.findByEmail(
        createUserDto.email,
      );
      const userByUsername = await this.findByUsername(
        createUserDto.username,
      );

      if (userByEmail) { throw new ConflictException('This email already existed!'); }
      if (userByUsername) { throw new ConflictException('This username already existed!'); };

      createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
      const payload = {
        email: createUserDto.email
      };
      const confirmToken = this.jwtService.sign(
        payload
        , { secret: this.configService.get<string>('SECRET_KEY_CONFIRM_EMAIL') }
      );
      console.log(confirmToken);
      const link = `localhost:3000/users/register/${confirmToken}`;
      this.sendMailConfirm(createUserDto, link);
      return this.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }
  // for login route
  public async login(loginDto: LoginDto) {
    try {
      const user = await this.findByEmail(loginDto.email);

      if (!user) throw new NotFoundException('Wrong Email!');

      if (!user.isConfirmed) {
        throw new UnauthorizedException(
          'Your account is not confirmed yet, please check your mail');
      }

      const passwordIsValid = bcrypt.compareSync(
        loginDto.password,
        user.password,
      );

      if (!passwordIsValid == true) {
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }

      const payload = {
        name: user.name,
        email: user.email,
        id: user.id,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        expiresIn: 3600,
        accessToken: accessToken,
        payload: payload,
      };
    } catch (error) {
      throw error;
    }

  }

  //for forgot password route
  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ) {
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
      await this.userRepository.save(user);
      return {};
    } catch (error) {
      throw error;
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




  //Need to rewrite
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
  public async confirmEmailRegistration(token: string): Promise<User> {
    try {
      const { email } = this.jwtService.verify(
        token,
        { secret: this.configService.get<string>('SECRET_KEY_CONFIRM_EMAIL') }
      );
      const user = await this.findByEmail(email);
      user.isConfirmed = true;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

}
