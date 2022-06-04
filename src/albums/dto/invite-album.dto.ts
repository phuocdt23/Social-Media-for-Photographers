import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class InviteToAlbum {
  @ApiProperty({ example: 'user002' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'AlbumId' })
  @IsString()
  @IsNotEmpty()
  readonly albumId: string;
}
