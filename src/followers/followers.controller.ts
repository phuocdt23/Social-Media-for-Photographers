import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowersService } from './followers.service';

@ApiTags('Follow')
@ApiBearerAuth()
@Controller('follows')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get(':username')
  async create(@Param('username') username: string, @Req() req, @Res() res) {
    const rs = await this.followersService.followAndUnFollow(
      username,
      req.user,
    );
    return res.status(HttpStatus.OK).json({
      message: rs.message,
      status: 200,
      data: rs.data,
    });
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    const rs = await this.followersService.getAllFollowers(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'All the Follower Of Yours!',
      status: 200,
      data: rs,
    });
  }
}
