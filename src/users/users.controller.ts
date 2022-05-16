import { Controller, Get, Post, Body, Param, Put, Res, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interface/users.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':id')
  public async getUser(
    @Res() res,
    @Param('id') id: string,
  ): Promise<IUser> {
    const user = await this.usersService.findById(+id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: 200,
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }
}
