import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
@Injectable()
export class JwtVerifyMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('middleware');
      if (!req.headers.authorization) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Please Login To Access Resource!(do not have token!)',
          status: 401,
          data: {},
        });
      }
      const token = req.headers.authorization.split(' ')[1];
      const payload = await this.jwtService.verify(token);
      const user = await this.userService.findById(payload.id);
      req.user = user;
      next();
    } catch (error) {
      console.log('error middlewares');
      throw new UnauthorizedException(error);
    }
  }
}
