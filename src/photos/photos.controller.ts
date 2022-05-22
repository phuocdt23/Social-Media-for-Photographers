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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Param('albumId') albumId: string,
    @Req() req,
    @Res() res,
  ) {
    const data : CreatePhotoDto = {
      name: req.body.name,
      link: file.path
    }
    const rs = await this.photosService.create(req.user, albumId, data);
    return res.json(rs);
  }
}

//     const link = path.join('./images', file.filename);
//     console.log(link);
//     // const photo = await this.photosService.createPhoto(photodto, link);
//     res.json({ response });
//     // res.json({ photo, response });
//   }
// }
//   async create(
//     @UploadedFile() file,
//     // @Body() createPhotoDto: CreatePhotoDto,
//     @Res() res,
//     @Req() req,
//   ) {
//     console.log('-------------------file data----------------------\n', file);
//     console.log('-------------------user data----------------------\n', req.users);
//     // console.log('-------------------body data----------------------\n', createPhotoDto);
//     return res.json({ file });
//     // return this.photosService.create(createPhotoDto);
//   }

//   @Get()
//   findAll() {
//     return this.photosService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.photosService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
//     return this.photosService.update(+id, updatePhotoDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.photosService.remove(+id);
//   }
// }
