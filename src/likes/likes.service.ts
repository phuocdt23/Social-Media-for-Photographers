import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { PhotosService } from '../photos/photos.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly photosService: PhotosService,
    private readonly usersService: UsersService,
  ) {}
  public async like(photo: Photo, user: User) {
    const like = new Like();
    like.photo = photo;
    like.user = user;

    photo.likes.push(like);
    user.likes.push(like);

    await this.likesRepository.save(like);
    this.usersService.saveUser(user);
    this.photosService.savePhoto(photo);
  }
  public async likePhoto(x: User, photoId: string) {
    try {
      const photo = await this.photosService.getAllLikeOfPhoto(photoId);
      const user = await this.usersService.getAllLikeOfUser(x.id);

      if (!photo) {
        throw new NotFoundException(`Not Found Photo By This Id #${photoId}`);
      }

      if (!user) {
        throw new NotFoundException(`Not Found Photo By This Id #${photoId}`);
      }

      if (!photo.likes.length) {
        return {
          data: this.like(photo, user),
          message: 'Like Photo Successfully!',
        };
      } else {
        //get all like
        const { likes } = await this.getLikedUser(photoId);
        let flag = true;
        likes.forEach(async (like) => {
          const id = like.id;
          if (like.user.id === x.id) {
            flag = false;
            //unlike function
            await this.likesRepository.delete(id);
          }
        });

        if (flag) {
          return {
            data: this.like(photo, user),
            message: 'Like Photo Successfully!',
          };
        } else {
          return { data: {}, message: 'Unlike Photo Successfully!' };
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async getLikedUser(photoId: string) {
    const photo = await this.photosService.getAllLikeOfPhoto(photoId);
    if (!photo) {
      throw new NotFoundException(`Not Found Photo By This Id #${photoId}`);
    }
    return { likes: photo.likes, numberOfLike: photo.likes.length };
  }
  public async getAll(user: User) {
    const likes = await this.usersService.getAllLikeOfUser(user.id);
    return likes.likes;
  }
}
