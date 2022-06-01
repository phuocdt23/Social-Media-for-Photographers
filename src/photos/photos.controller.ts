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
  HttpStatus,
} from '@nestjs/common';
import { Express } from 'express';
import { PhotosService } from './photos.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../configs/uploadFile';
import { diskStorage } from 'multer';
@ApiTags('Photo')
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
    return res.status(HttpStatus.OK).json({
      message: 'Post Photo Successfully!',
      status: 200,
      data: rs,
    });
  }

  @Get('/:albumId')
  public async findAllByAlbumId(@Param('albumId') albumId: string, @Res() res) {
    const rs = await this.photosService.findAllOfAlbum(albumId);
    return res.status(HttpStatus.OK).json({
      message: `Get All Photo Of Album Id #${albumId} Successfully!`,
      status: 200,
      data: rs,
    });
  }
  @Get()
  public async findAll(@Req() req, @Res() res) {
    const rs = await this.photosService.findAll(req.user);
    return res.status(HttpStatus.OK).json({
      message: `Get All Photo Of An User Id #${req.user.id} Successfully!`,
      status: 200,
      data: rs,
    });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Res() res) {
    const rs = await this.photosService.findOne(id);
    return res.status(HttpStatus.OK).json({
      message: `Get Photo Has Id #${id} Successfully!`,
      status: 200,
      data: rs,
    });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
    @Res() res,
  ) {
    const rs = await this.photosService.update(id, updatePhotoDto);
    return res.status(HttpStatus.OK).json({
      message: `Change  Photo Has Id #${id} Successfully!`,
      status: 200,
      data: rs,
    });
  }

  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const rs = await this.photosService.remove(id, req.user);
    return res.status(HttpStatus.OK).json({
      message: `Delete Photo Has Id #${id} Successfully!`,
      status: 200,
      data: rs,
    });
  }
}
