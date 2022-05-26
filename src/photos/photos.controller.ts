import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { Express } from 'express';
import { PhotosService } from './photos.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/configs/uploadFile';
import { diskStorage } from 'multer';
import path from 'path';
@ApiTags('Photos')
@ApiBearerAuth()
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post(':albumId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  public async create(
    @UploadedFile() file: Express.Multer.File,
    @Param('albumId') albumId: string,
    @Req() req,
    @Res() res,
  ) {
    const data: CreatePhotoDto = {
      name: req.body.name,
      link: file.path,
    };
    const rs = await this.photosService.create(req.user, albumId, data);
    return res.json(rs);
  }

  @Get('/:albumId')
  public async findAllByAlbumId(@Param('albumId') albumId: string, @Res() res) {
    const rs = await this.photosService.findAllOfAlbum(albumId);
    return res.json({ rs });
  }
  @Get()
  public async findAll(@Req() req, @Res() res) {
    const rs = await this.photosService.findAll(req.user);
    return res.json({ rs });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Res() res) {
    const rs = await this.photosService.findOne(id);
    return res.json({ rs });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    return await this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.photosService.remove(id);
  }
}
