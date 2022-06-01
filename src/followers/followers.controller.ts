import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowUserDto } from './dto/follow-user.dto';
import { FollowersService } from './followers.service';

@ApiTags('Follow')
@ApiBearerAuth()
@Controller('follows')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get('/getFollowingUsers')
  async getFollowingUser(@Req() req, @Res() res) {
    const rs = await this.followersService.getAllFollowingUser(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'All of users that you are following!',
      status: 200,
      data: { rs },
    });
  }

  @Get('/getAllFollowers')
  async findAll(@Req() req, @Res() res) {
    const rs = await this.followersService.getAllFollowers(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'All the Follower Of Yours!',
      status: 200,
      data: rs,
    });
  }

  @Post('followTo')
  async create(@Body() followUserdto: FollowUserDto, @Req() req, @Res() res) {
    const rs = await this.followersService.followAndUnFollow(
      followUserdto.username,
      req.user,
    );
    return res.status(HttpStatus.OK).json({
      message: rs.message,
      status: 200,
      data: {},
    });
  }

  @Get('newsFeed')
  async newsFeet(@Req() req, @Res() res) {
    const rs = await this.followersService.getPhotoOfFollowingUser(req.user);
    return res.status(HttpStatus.OK).json({
      message: `Success to Get Photo From Following User`,
      status: 200,
      data: rs,
    });
  }
}
