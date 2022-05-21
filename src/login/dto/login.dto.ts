import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user001@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;
}
