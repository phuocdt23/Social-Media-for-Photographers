import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class InviteToAlbum {
  @ApiProperty({ example: 'user002@gmail.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'AlbumId' })
  @IsString()
  @IsNotEmpty()
  readonly albumId: string;

}
