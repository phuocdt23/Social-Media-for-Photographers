import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class FollowUserDto extends PickType(CreateUserDto, [
  'username',
] as const) {}
