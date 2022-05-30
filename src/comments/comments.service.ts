import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
  ) {}
  public async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    try {
      const photo = await this.photosRepository.findOne(
        createCommentDto.photoId,
      );
      if (!photo) {
        throw new NotFoundException(
          `Invalid photoId #${createCommentDto.photoId}, Not found Photo`,
        );
      }
      const comment = new Comment();
      comment.content = createCommentDto.content;
      comment.user = user;
      comment.photo = photo;
      return await this.commentsRepository.save(comment);
    } catch (error) {
      throw error;
    }
  }

  public async findAllCommentUser(user: User): Promise<Comment[]> {
    try {
      const comments = await this.commentsRepository.find({
        where: { user: user },
      });
      //raw query for comments
      //................................................................
      return comments;
    } catch (error) {
      throw error;
    }
  }
  public async findAllCommentPhoto(id: string) {
    try {
      const photo = await this.photosRepository.findOne(id);
      if (!photo) {
        throw new NotFoundException(`Invalid photoId #${id}, Not found Photo`);
      }
      const comments = await this.commentsRepository.find({
        where: { photo: photo },
      });
      //raw query for comments
      //................................................................
      return comments;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.commentsRepository.findOne(id);
      if (!comment) {
        throw new NotFoundException(`Invalid photoId #${id}, Not found Photo`);
      }
      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.commentsRepository.findOne(id);
      if (!comment) {
        throw new NotFoundException(`Invalid photoId #${id}, Not found Photo`);
      }
      comment.content = updateCommentDto.content;
      return await this.commentsRepository.save(comment);
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: string) {
    try {
      const comment = await this.commentsRepository.findOne(id);
      if (!comment) {
        throw new NotFoundException(`Invalid photoId #${id}, Not found Photo`);
      }
      return await this.commentsRepository.delete(comment);
    } catch (error) {
      throw error;
    }
  }
}
