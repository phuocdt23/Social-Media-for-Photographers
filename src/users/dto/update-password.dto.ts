import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: '123123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ example: '124124' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  newPassword: string;
}
