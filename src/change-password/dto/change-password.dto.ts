import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;
}
