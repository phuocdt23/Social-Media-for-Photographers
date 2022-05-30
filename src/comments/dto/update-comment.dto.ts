import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'comment1' })
  @IsString()
  @MaxLength(1000)
  content: string;
}
