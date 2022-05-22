import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumsService } from 'src/albums/albums.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>, // private readonly usersService: UsersService,
    private readonly albumsService: AlbumsService, // private readonly usersService: UsersService,
  ) { }
  async create(user: User, albumId, data) {
    try {
      const album = await this.albumsService.findById(albumId);
      if(!album){
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

  findAll() {
    return `This action returns all photos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
