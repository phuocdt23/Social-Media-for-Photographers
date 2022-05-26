import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user001' })
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({ example: 'user001' })
  @IsString()
  @MaxLength(40)
  readonly username: string;

  @ApiProperty({ example: 'user001@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @MinLength(6)
  password: string;
}
