import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth/change-password')
export class ChangePasswordController {
  constructor(
    private readonly changePasswordService: ChangePasswordService,
    // private readonly jwtService: JwtService,
  ) {}
  // @Post(':token')
  // public async changePassword(
  //   @Res() res,
  //   @Param('token') token: string,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ): Promise<any> {
  //   try {
  //     const { email } = this.jwtService.verify(token);
  //     const result = await this.changePasswordService.changePassword(
  //       email,
  //       changePasswordDto,
  //     );
  //     if (result.status == 409) {
  //       return res.status(HttpStatus.CONFLICT).json({ result });
  //     }
  //     if (result.status == 403) {
  //       return res.status(HttpStatus.FORBIDDEN).json({ result });
  //     }
  //     return res.status(HttpStatus.OK).json({
  //       message: 'Request Change Password Successfully!',
  //       status: 200,
  //     });
  //   } catch (err) {
  //     throw new UnauthorizedException();
  //   }
  // }
}
