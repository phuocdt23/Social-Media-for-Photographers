import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { AlbumsService } from '../albums/albums.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>, // private readonly usersService: UsersService,
    private readonly albumsService: AlbumsService, // private readonly usersService: UsersService,
  ) {}

  public async savePhoto(photo: Photo): Promise<Photo> {
    return await this.photosRepository.save(photo);
  }

  public async create(user: User, albumId, data) {
    try {
      const album = await this.albumsService.findById(albumId);
      if (!album) {
        return new NotFoundException('album do not exist');
      }
      const photo = new Photo();
      photo.name = data.name;
      photo.link = data.link;
      photo.album = album;
      photo.user = user;
      return await this.photosRepository.save(photo);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(user: User): Promise<Photo[]> {
    try {
      return await this.photosRepository.find({
        select: ['id', 'name', 'link'],
        where: { user: user },
      });
    } catch (error) {
      throw error;
    }
  }
  public async findAllOfAlbum(albumId: string): Promise<Photo[]> {
    try {
      const album = await this.albumsService.findById(albumId);
      return await this.photosRepository.find({
        select: ['id', 'name', 'link'],
        where: { album: album },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: string) {
    return await this.photosRepository.findOne({ id });
  }

  public async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.photosRepository.findOne({ id });
    photo.name = updatePhotoDto.name;
    return await this.photosRepository.save(photo);
  }

  public async remove(id: string, user: User) {
    const photo = await this.photosRepository.findOne({ id });
    if (photo.ownerId !== user.id) {
      throw new UnauthorizedException('You are not owner of this photo!');
    }
    await fs.unlink(photo.link, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    });
    return await this.photosRepository.delete(photo.id);
  }

  public async getAllLikeOfPhoto(photoId: string) {
    const likes = await this.photosRepository.findOne(photoId, {
      relations: ['likes'],
    });
    return likes;
  }
}
