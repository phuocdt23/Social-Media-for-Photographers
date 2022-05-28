import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
@ApiTags('Like')
@ApiBearerAuth()
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get(':photoId')
  public async like(@Param('photoId') photoId: string, @Req() req, @Res() res) {
    const rs = await this.likesService.likePhoto(req.user, photoId);
    return res.status(HttpStatus.OK).json({
      message: rs.message,
      status: 200,
      data: rs.data,
    });
  }
  @Get('/likedUser/:photoId')
  public async getUserLiked(
    @Param('photoId') photoId: string,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.likesService.getLikedUser(photoId);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Liked Photo Successfully!',
      status: 200,
      data: rs,
    });
  }
  @Get()
  public async getAllLikeOfUser(@Req() req, @Res() res) {
    const rs = await this.likesService.getAll(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Liked Photo Successfully!',
      status: 200,
      data: rs,
    });
  }
}
