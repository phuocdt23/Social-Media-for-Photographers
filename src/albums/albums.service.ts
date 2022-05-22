import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>, // private readonly usersService: UsersService,
  ) {}
  public async create(
    createAlbumDto: CreateAlbumDto,
    user: User,
  ): Promise<Album> {
    try {
      const album = new Album();
      album.name = createAlbumDto.name;
      album.description = createAlbumDto.description;
      album.users = [];
      album.users.push(user);
      return await this.albumsRepository.save(album);
    } catch (error) {
      throw new Error();
    }
  }

  public async findAll(user: User): Promise<Album[]> {
    try {
      const albums = await this.albumsRepository.find({
        select: ['id', 'name', 'description'],
        where: { ownerId: user.id },
      });
      return albums;
    } catch (error) {
      throw new Error();
    }
  }

  public async findOne(id: string): Promise<Album> {
    try {
      return await this.albumsRepository.findOne(id, { relations: ['users'] });
    } catch (error) {
      throw new Error();
    }
  }
  public async findById(id: string): Promise<Album> {
    try {
      return await this.albumsRepository.findOne(id);
    } catch (error) {
      throw new Error();
    }
  }

  public async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    try {
      const album = await this.findOne(id);
      album.name = updateAlbumDto.name;
      album.description = updateAlbumDto.description;
      return await this.albumsRepository.save(album);
    } catch (error) {
      throw new Error();
    }
  }

  public async remove(id: string) {
    try {
      // unchecked owner yet!
      console.log(await this.albumsRepository.delete(id));
      return this.albumsRepository.delete(id);
    } catch (error) {
      throw new Error();
    }
  }
}
