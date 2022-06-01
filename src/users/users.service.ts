import {
  Injectable,
  HttpException,
  HttpStatus,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FollowersService } from '../followers/followers.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => FollowersService))
    private readonly followerService: FollowersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async findOneUser(filter: any): Promise<User> {
    try {
      const { id, email, username } = filter;
      if (!id) {
        const user = await this.userRepository.findOne({
          where: [{ email }, { username }],
        });
        return user;
      }
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw new NotFoundException('User Not Found In Database');
    }
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.findOneUser({ id: id });
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
    user: User,
  ): Promise<User> {
    try {
      const passwordIsValid = bcrypt.compareSync(
        updatePasswordDto.currentPassword,
        user.password,
      );

      if (!passwordIsValid) {
        throw new HttpException(
          'Invalid Current Password',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (updatePasswordDto.currentPassword === updatePasswordDto.newPassword) {
        throw new HttpException(
          'Your new pasword cannot be same as your old password!',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = bcrypt.hashSync(updatePasswordDto.newPassword, 8);
      return await this.userRepository.save(user);
    } catch (err) {
      throw err;
    }
  }
  // for register account
  public async register(createUserDto: CreateUserDto) {
    try {
      const userByEmail = await this.findOneUser({
        email: createUserDto.email,
      });
      const userByUsername = await this.findOneUser({
        username: createUserDto.username,
      });

      if (userByEmail) {
        throw new ConflictException('This email already existed!');
      }
      if (userByUsername) {
        throw new ConflictException('This username already existed!');
      }

      createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
      const payload = {
        email: createUserDto.email,
      };
      const confirmToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_KEY_CONFIRM_EMAIL'),
      });
      console.log(confirmToken);
      const link = `localhost:3000/users/register/${confirmToken}`;
      this.sendMailConfirm(createUserDto, link);
      const rs = await this.userRepository.save(createUserDto);
      return { user: rs, tokenConfirmation: confirmToken };
    } catch (error) {
      throw error;
    }
  }
  // for login route
  public async login(loginDto: LoginDto) {
    try {
      const user = await this.findOneUser({ email: loginDto.email });

      if (!user) throw new NotFoundException('Wrong Email!');

      if (!user.isConfirmed) {
        throw new UnauthorizedException(
          'Your account is not confirmed yet, please check your mail',
        );
      }

      const passwordIsValid = bcrypt.compareSync(
        loginDto.password,
        user.password,
      );

      if (passwordIsValid == false) {
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
  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        email: forgotPasswordDto.email,
      });
      if (!user) {
        return new NotFoundException('That email does not have an account');
      }
      const passwordRandom = Math.random().toString(36).slice(-8);
      user.password = bcrypt.hashSync(passwordRandom, 8);
      await this.userRepository.save(user);
      this.sendMailForgotPassword(forgotPasswordDto.email, passwordRandom);
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
      const { email } = this.jwtService.verify(token, {
        secret: this.configService.get<string>('SECRET_KEY_CONFIRM_EMAIL'),
      });
      const user = await this.findOneUser({ email: email });
      user.isConfirmed = true;
      // create follower with the same id with registered user
      this.followerService.createById(user.id);
      return await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  public async getAllFollowers(user: User) {
    try {
      const rs = await this.userRepository
        .createQueryBuilder()
        .leftJoinAndSelect('User.followers', 'Follow')
        .where('User.id = :id', { id: user.id })
        .getOne();
      return rs;
    } catch (error) {
      throw error;
    }
  }

  public async getAllLikeOfUser(userId: string) {
    const likes = this.userRepository.findOne(userId, {
      relations: ['likes'],
    });
    return likes;
  }
}
