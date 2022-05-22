import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty({ example: 'changed name album 1' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'changed description album 1' })
  @IsString()
  @MaxLength(200)
  readonly description: string;
}
