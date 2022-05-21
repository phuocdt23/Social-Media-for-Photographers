import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class CreateAlbumDto {
  @ApiProperty({ example: 'album1' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'baroque, studying music' })
  @IsString()
  @MaxLength(200)
  readonly description: string;
}
