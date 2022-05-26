import {
  Controller,
  Get,
  Body,
  Put,
  Res,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  Req,
  Post,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto'
@ApiTags('users')
// @ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get()
  public async getUser(@Res() res, @Req() req) {
    try {
      const user = await this.usersService.findById(req.user.id);

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      return res.status(HttpStatus.OK).json({
        message: 'Get Info Successfully!',
        statusCode: 200,
        data: user,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Put()
  public async update(
    @Res() res,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.usersService.updateUser(
        req.user.id,
        updateUserDto,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Change Successfully!',
        statusCode: 200,
        data: result,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  @Post('register')
  public async register(
    @Res() res,
    @Req() req,
    @Body() createUserDto: CreateUserDto) {

    const rs = await this.usersService.register(createUserDto);
    return res.status(HttpStatus.OK).json({
      message: 'You need to check your mail to confirm registration!',
      statusCode: 200,
      data: rs
    });
  }
  @Get('register/:token')
  public async handleConfirmation(
    @Res() res,
    @Param('token') token: string,
  ){
    try {
      const rs = await this.usersService.confirmEmailRegistration(token);
      return res.status(HttpStatus.OK).json({
        message: 'Confirm Email Registration Successfully!',
        statusCode: 200,
        data: rs
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        statusCode: error.status,
        data: error
      });
    }
  }
}
