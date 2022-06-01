import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'changedName001' })
  @IsString()
  @MaxLength(30)
  @MinLength(6)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'changedUsername001' })
  @IsString()
  @MaxLength(40)
  @MinLength(6)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'changedname001@gmail.com' })
  @IsEmail()
  @MinLength(6)
  @IsNotEmpty()
  email: string;
}
