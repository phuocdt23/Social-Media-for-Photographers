import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ChangePasswordService {
  // constructor(private readonly usersService: UsersService) {}

  // public async changePassword(
  //   email: string,
  //   changePasswordDto: ChangePasswordDto,
  // ): Promise<any> {
  //   return await this.usersService.updateByPassword(
  //     email,
  //     changePasswordDto.password,
  //     changePasswordDto.newPassword,
  //   );
  // }
}
