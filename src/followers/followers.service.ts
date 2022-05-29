import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async followAndUnFollow(username: string, user: User) {
    try {
      console.log('-----------------------------------------\n');

      // logined user ==> followerId, user find by username ==> userId
      const follower = await this.followerRepository.findOne(user.id, {
        relations: ['users'],
      });
      const idol = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });

      if (!idol) {
        throw new NotFoundException(`This username #${username} do not exist!`);
      }

      if (!follower.users.length) {
        follower.users = [];
        follower.users.push(idol);
        const rs = await this.followerRepository.save(follower);
        console.log(rs);
      } else {
        console.log(2);
        //check idol in users[]
        //true <=>have followed
        let flag = false;
        for (const idolInArray of follower.users) {
          console.log(idolInArray);
          if (idolInArray.id === idol.id) {
            console.log('found---------------------');
            //  unfollow
            //delete an element in following user(idol)
            console.log('do unfollow');
            follower.users.splice(follower.users.indexOf(idolInArray), 1);
            await this.followerRepository.save(follower);
            flag = true;
            break;
          }
        }
        console.log(flag);
        if (!flag) {
          console.log('do follow');
          follower.users.push(idol);
          const rs = await this.followerRepository.save(follower);
          return {
            message: `Follow User #${username} Successfully!`,
            data: rs,
          };
        } else {
          return {
            message: `Unfollow user #${username} Successfully!`,
            data: follower.users,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async getAllFollowers(user: User) {
    try {
      // const album = await this.albumsRepository
      //   .createQueryBuilder()
      //   .leftJoinAndSelect('Album.users', 'User')
      //   .where('User.id = :id', { id: user.id })
      //   .getMany();
      const rs = await this.followerRepository
        .createQueryBuilder()
        .leftJoinAndSelect('Follower.users', 'User')
        .where('User.id = :id', { id: user.id })
        .getMany();
      return rs;
    } catch (error) {
      throw error;
    }
  }
}
