import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Res,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':token')
  public async getUser(
    @Res() res,
    @Param('token') token: string,
  ): Promise<any> {
    try {
      const encodedData = this.jwtService.verify(token);
      console.log(encodedData);
      const user = await this.usersService.findById(encodedData.id);

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      return res.status(HttpStatus.OK).json({
        user: user,
        status: 200,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Put(':token')
  public async update(
    @Res() res,
    @Param('token') token: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const encodedData = this.jwtService.verify(token);
      const result = await this.usersService.updateUser(
        encodedData.id,
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
