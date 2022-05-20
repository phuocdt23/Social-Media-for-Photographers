import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
export class CreateAlbumDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(200)
  readonly description: string;
}
