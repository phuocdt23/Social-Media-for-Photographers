import { Injectable, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
  public async updateByPassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      if (oldPassword === newPassword) {
        throw new HttpException('Your password not changed yet', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userRepository.findOne({ email });
      // const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

      // if (!passwordIsValid == true) {
      //   throw new HttpException('Invalid Password asdfasdfasd', HttpStatus.BAD_REQUEST);
      // }

      user.password = bcrypt.hashSync(newPassword, 8);
      return await this.userRepository.save(user);
    } catch (err) {
      throw err;
    }
  }
  public async register(
    createUserDto: CreateUserDto,
  ) {
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
      email: createUserDto.email,
    };
    const confirmToken = this.jwtService.sign(
      payload,
      // {
      //   secret: this.configService.get<string>('SECRET_KEY_CONFIRM_EMAIL'),
      //   expiresIn: 300
      // }
      );
    console.log(confirmToken);
    const link = `localhost:3000/users/register/${confirmToken}`;
    this.sendMailConfirm(createUserDto, link);
    return this.create(createUserDto);
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
  public async confirmEmailRegistration(token: string): Promise<User> {
    const { email } = this.jwtService.verify(token);
    const user = await this.findByEmail(email);
    user.isConfirmed = true;
    return await this.userRepository.save(user);
  }

}
