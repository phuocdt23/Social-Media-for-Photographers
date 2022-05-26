import {
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
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const payload = await this.jwtService.verify(token);
      const user = await this.userService.findById(payload.id);
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
