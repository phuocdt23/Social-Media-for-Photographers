import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'changedName001' })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'changedUsername001' })
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'changedname001@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
