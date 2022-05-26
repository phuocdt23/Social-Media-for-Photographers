import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user001@gmail.com' })
  @IsEmail()
  readonly email: string;

  // register with gmail either username
  // @ApiProperty({ example: 'user001' })
  // @IsString()
  // readonly username: string;
  
  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;
}
