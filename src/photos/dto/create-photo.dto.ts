import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
export class CreatePhotoDto {
  @ApiProperty({example: 'image1'})
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsString()
  link: string;
}
