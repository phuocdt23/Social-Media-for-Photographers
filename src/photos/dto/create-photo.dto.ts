import { IsString, MaxLength } from 'class-validator';
export class CreatePhotoDto {
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsString()
  link: string;
}
