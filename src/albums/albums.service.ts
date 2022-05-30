import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumsRepository: Repository<Album>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  public async create(
    createAlbumDto: CreateAlbumDto,
    user: User,
  ): Promise<Album> {
    try {
      const album = new Album();
      album.name = createAlbumDto.name;
      album.description = createAlbumDto.description;
      album.ownerId = user.id;
      album.users = [];
      album.users.push(user);
      return await this.albumsRepository.save(album);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  public async findOne(id: string): Promise<Album> {
    try {
      return await this.albumsRepository.findOne(id, { relations: ['users'] });
    } catch (error) {
      throw error;
    }
  }
  public async findById(id: string): Promise<Album> {
    try {
      return await this.albumsRepository.findOne(id);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  public async remove(id: string, user: User) {
    try {
      const album = await this.findOne(id);
      if (album.ownerId !== user.id) {
        throw new UnauthorizedException('You are not owner of this album!');
      }
      const rs = await this.albumsRepository.delete(id);
      // need to delete all photo in this album!
      return rs;
    } catch (error) {
      throw error;
    }
  }
  public async invite(inviteToAlbum) {
    try {
      const user = await this.usersService.findByEmail(inviteToAlbum.email);
      const album = await this.findOne(inviteToAlbum.albumId);
      if (!user) {
        return new NotFoundException('User email not found!');
      }
      if (!album) {
        return new NotFoundException('Email does not exist!');
      }
      const payload = {
        email: inviteToAlbum.email,
        albumId: inviteToAlbum.albumId,
      };
      const inviteToken = this.jwtService.sign(payload);
      console.log(inviteToken);
      const link = `localhost:3000/albums/handleInviation/${inviteToken}`;
      const rs = this.sendMailInvite(inviteToAlbum, link);
      return rs;
    } catch (error) {
      throw error;
    }
  }
  private sendMailInvite(user, link): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Invite to Album',
        text: 'Invite to Album!',
        template: 'index',
        context: {
          title: 'Invite to Album',
          link,
          description: `In order to complete registration please click Invite`,
        },
      })
      .then((rs) => {
        console.log('Invite User: Send Mail Invite successfully!', rs);
        return rs;
      })
      .catch(() => {
        console.log('Invite User: Send Mail Invite Failed!');
      });
  }
  public async getAllAlbumJoined(user: User): Promise<Album[]> {
    try {
      const album = await this.albumsRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Album.users', 'User')
        .where('User.id = :id', { id: user.id })
        .getMany();
      return album;
    } catch (error) {
      throw error;
    }
  }
  public async handleInvitation(token: string) {
    try {
      const { email, albumId } = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(email);

      const album = await this.findOne(albumId);
      album.users.push(user);
      return await this.albumsRepository.save(album);
    } catch (error) {
      throw error;
    }
  }
}
