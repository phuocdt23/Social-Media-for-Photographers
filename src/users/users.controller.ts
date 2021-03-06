import {
  Controller,
  Get,
  Body,
  Res,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  Req,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //need to review
  @ApiBearerAuth()
  @Get()
  public async getUser(@Res() res, @Req() req) {
    const user = await this.usersService.findOneUser({ id: req.user.id });

    return res.status(HttpStatus.OK).json({
      message: 'Get Info Successfully!',
      status: 200,
      data: user,
    });
  }
  //need to review
  @ApiBearerAuth()
  @Patch()
  public async update(
    @Res() res,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const rs = await this.usersService.updateUser(req.user.id, updateUserDto);
    return res.status(HttpStatus.OK).json({
      message: 'Change Successfully!',
      status: 200,
      data: rs,
    });
  }
  @Post('register')
  public async register(@Res() res, @Body() createUserDto: CreateUserDto) {
    const rs = await this.usersService.register(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'You need to check your mail to confirm registration!',
      status: 201,
      data: rs,
    });
  }
  @Get('register/:token')
  public async handleConfirmation(@Res() res, @Param('token') token: string) {
    const rs = await this.usersService.confirmEmailRegistration(token);

    return res.status(HttpStatus.OK).json({
      message: 'Confirm Email Registration Successfully!',
      status: 200,
      data: rs,
    });
  }
  @Post('login')
  public async login(@Body() loginDto: LoginDto, @Res() res) {
    const rs = await this.usersService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      message: 'Login Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Post('forgot-password')
  public async forgotPassword(
    @Res() res,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const rs = await this.usersService.forgotPassword(forgotPasswordDto);
    return res.status(HttpStatus.OK).json({
      message: `Your new password has sent to your mail(${forgotPasswordDto.email})!`,
      status: 200,
      data: rs,
    });
  }
  @ApiBearerAuth()
  @Post('change-password')
  public async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.usersService.updatePassword(
      updatePasswordDto,
      req.user,
    );
    return res.status(HttpStatus.OK).json({
      message: `Change Password Successfully!`,
      status: 200,
      data: rs,
    });
  }
}
