import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), AlbumsModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
