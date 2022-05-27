import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  public async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.commentsService.create(createCommentDto, req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Create Comment Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Get('allCommentOfUser')
  public async findAllCommentUser(@Req() req, @Res() res) {
    const rs = await this.commentsService.findAllCommentUser(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Comment Of An User Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Get('allCommentOfPhoto/:photoId')
  public async findAllCommentPhoto(
    @Param('photoId') id: string,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.commentsService.findAllCommentPhoto(id);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Comment Of An Photo Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    const rs = await this.commentsService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: 'Get One Comment Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.commentsService.update(id, updateCommentDto);
    return res.status(HttpStatus.OK).json({
      message: 'Update Comment Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const rs = await this.commentsService.remove(id);
    return res.status(HttpStatus.OK).json({
      message: 'Remove Comment Successfully!',
      status: 200,
      data: rs,
    });
  }
}
