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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  public async getUser(@Res() res, @Req() req): Promise<any> {
    try {
      const user = await this.usersService.findById(req.user.id);

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      return res.status(HttpStatus.OK).json({
        user: user,
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
  ): Promise<any> {
    try {
      const result = await this.usersService.updateUser(
        req.user.id,
        updateUserDto,
      );
      return res.status(HttpStatus.OK).json({
        result: result,
        message: 'Change Successfully!',
        status: 200,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
