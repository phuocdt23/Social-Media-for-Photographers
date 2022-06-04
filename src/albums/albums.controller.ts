import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { InviteToAlbum } from './dto/invite-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@ApiTags('Album')
@ApiBearerAuth()
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  public async create(
    @Body() createAlbumDto: CreateAlbumDto,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.albumsService.create(createAlbumDto, req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Create Album Successfully!',
      status: 200,
      data: rs,
    });
  }
  @Post('inviteToAlbum')
  public async inviteToAlbum(
    @Body() inviteToAlbum: InviteToAlbum,
    @Req() req,
    @Res() res,
  ) {
    const rs = await this.albumsService.invite(inviteToAlbum);
    return res.status(HttpStatus.OK).json({
      message:
        'Invite To Album Successfully! (Sending mail to user successfully)',
      status: 200,
      data: rs,
    });
  }
  @Get('handleInviation/:token')
  public async handleInvite(@Param('token') token: string, @Res() res) {
    const rs = await this.albumsService.handleInvitation(token);
    return res.status(HttpStatus.OK).json({
      message: 'Handle Invite Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Get()
  public async findAll(@Req() req, @Res() res) {
    const rs = await this.albumsService.findAll(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Your Album Successfully!',
      status: 200,
      data: rs,
    });
  }
  @Get('/allAlbumJoined')
  public async findAllJoinedAlbum(@Req() req, @Res() res) {
    const rs = await this.albumsService.getAllAlbumJoined(req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Get All Album You Joined!',
      status: 200,
      data: rs,
    });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Res() res) {
    const rs = await this.albumsService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: 'Get One Album Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res() res,
  ) {
    const rs = await this.albumsService.update(id, updateAlbumDto);
    return res.status(HttpStatus.OK).json({
      message: 'Update Album Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Delete(':id')
  public async remove(@Req() req, @Res() res, @Param('id') id: string) {
    const rs = await this.albumsService.remove(id, req.user);
    return res.status(HttpStatus.OK).json({
      message: 'Delete Album Successfully!',
      status: 200,
      data: rs,
    });
  }
}
