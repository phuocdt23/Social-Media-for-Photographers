import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  photoId: string;

  @ApiProperty({ example: 'comment1' })
  @IsString()
  @MaxLength(1000)
  content: string;
}
