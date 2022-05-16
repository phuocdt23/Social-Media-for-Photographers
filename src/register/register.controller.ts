import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  public async register(
    @Res() res,
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<any> {
    try {
      const rs = await this.registerService.register(registerUserDto);
      if (rs === `existingUsername`) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'This username already existed!',
          status: 409,
        });
      }
      if (rs === `existingEmail`) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'This email already existed!',
          status: 409,
        });
      }
      return res.status(HttpStatus.OK).json({
        message: 'User registration successfully!',
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: User not registration!',
        status: 400,
      });
    }
  }

  // @Get(':token')
  // public async handleConfirmation(@Res() res, @Param() token): Promise<any> {}
}
