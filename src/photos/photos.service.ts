import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumsService } from 'src/albums/albums.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import * as fs from 'fs';
@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>, // private readonly usersService: UsersService,
    private readonly albumsService: AlbumsService, // private readonly usersService: UsersService,
  ) {}
  async create(user: User, albumId, data) {
    try {
      const album = await this.albumsService.findById(albumId);
      if (!album) {
        return new Error('album do not exist');
      }
      const photo = new Photo();
      photo.name = data.name;
      photo.link = data.link;
      photo.album = album;
      photo.user = user;
      return await this.photosRepository.save(photo);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(user: User): Promise<Photo[]> {
    try {
      return await this.photosRepository.find({
        select: ['id', 'name', 'link'],
        where: { user: user },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllOfAlbum(albumId: string): Promise<Photo[]> {
    try {
      const album = await this.albumsService.findById(albumId);
      return await this.photosRepository.find({
        select: ['id', 'name', 'link'],
        where: { album: album },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    return await this.photosRepository.findOne({ id });
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.photosRepository.findOne({ id });
    photo.name = updatePhotoDto.name;
    return await this.photosRepository.save(photo);
  }

  async remove(id: string) {
    const photo = await this.photosRepository.findOne({ id });
    await fs.unlink(photo.link, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    });
    return await this.photosRepository.delete(photo);
  }
}
