import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { InviteToAlbum } from './dto/invite-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
@ApiTags('albums')
@ApiBearerAuth()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Req() req) {
    return this.albumsService.create(createAlbumDto, req.user);
  }
  @Post('invite_to_album')
  async inviteToAlbum(@Body() inviteToAlbum: InviteToAlbum, @Req() req) {
    const rs = await this.albumsService.invite(inviteToAlbum);
    console.log(rs);
    return rs;
  }
  @Get('handle/:token')
  async handleInvite(@Param('token') token: string) {
    const rs = await this.albumsService.handleInvitation(token);
    console.log(rs);
    return rs;
  }

  @Get()
  findAll(@Req() req) {
    return this.albumsService.findAll(req.user);
  }
  @Get('/all')
  findAllJoinedAlbum(@Req() req) {
    return this.albumsService.getAllAlbumJoined(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(id);
  }
}
