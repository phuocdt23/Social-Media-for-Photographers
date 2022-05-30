import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async createById(id: string) {
    const follower = new Follower();
    follower.id = id;
    return this.followerRepository.save(follower);
  }
  public async followAndUnFollow(username: string, user: User) {
    try {
      // logined user ==> followerId, user find by username ==> userId
      const follower = await this.followerRepository.findOne(user.id, {
        relations: ['users'],
      });

      const idol = await this.usersService.findOneUser({
        username: username,
      });

      if (!idol) {
        throw new NotFoundException(`This username #${username} do not exist!`);
      }

      if (!follower.users.length) {
        console.log(`do follow`);

        follower.users = [];
        follower.users.push(idol);

        const rs = await this.followerRepository.save(follower);

        return {
          message: `Follow User #${username} Successfully!`,
          data: rs,
        };
      } else {
        //check idol in users[]

        let flag = false;
        for (const idolInArray of follower.users) {
          console.log(idolInArray);

          if (idolInArray.id === idol.id) {
            //  unfollow and switch flag
            //delete an element in following user(idol)
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
          await this.followerRepository.save(follower);

          return {
            message: `Follow User #${username} Successfully!`,
          };
        } else {
          return {
            message: `Unfollow user #${username} Successfully!`,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async getAllFollowers(user: User) {
    try {
      const rs = await this.usersService.getAllFollowers(user);
      return {
        followers: rs.followers,
        numberOfYourFollower: rs.followers.length,
      };
    } catch (error) {
      throw error;
    }
  }
}
