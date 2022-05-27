import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
@ApiTags('Like')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // @Get(':photoId')
  // public async like(@Param('photoId') photoId: string, @Req() req, @Res() res) {
  //     const rs = await this.likesService.likePhoto(req.user,)
  // }
}
