import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  readonly id: number;
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(40)
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
