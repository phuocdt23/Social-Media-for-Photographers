import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
// import { JwtPayload } from './interfaces/jwt.payload';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    // private readonly usersService: UsersService,
    // private readonly jwtService: JwtService,
  ) { }

  // private async validate(loginDto: LoginDto): Promise<any> {
  //   return await this.usersService.findByEmail(loginDto.email);
  // }

  // public async login(
  //   loginDto: LoginDto,
  // ): Promise<any> {
  //   return this.validate(loginDto)
  //     .then((userData) => {
  //       if (!userData) {
  //         throw new NotFoundException('Wrong Email!');
  //       }

  //       if (!userData.isConfirmed) {
  //         throw new UnauthorizedException(
  //         'Your account is not confirmed yet, please check your mail');

  //       }

  //       const passwordIsValid = bcrypt.compareSync(
  //         loginDto.password,
  //         userData.password,
  //       );

  //       if (!passwordIsValid == true) {
  //         throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
  //       }

  //       const payload = {
  //         name: userData.name,
  //         email: userData.email,
  //         id: userData.id,
  //       };

  //       const accessToken = this.jwtService.sign(payload);

  //       return {
  //         expiresIn: 3600,
  //         accessToken: accessToken,
  //         user: payload,
  //       };
  //     })
  // }
}
