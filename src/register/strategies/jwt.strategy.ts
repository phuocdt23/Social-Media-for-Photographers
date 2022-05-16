import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterService } from '../register.service';
import { PassportStrategy } from '@nestjs/passport';
// import { JwtPayload } from '../interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly registerService: RegisterService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY_CONFIRM_EMAIL,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return { email: payload.email };
  }
}
