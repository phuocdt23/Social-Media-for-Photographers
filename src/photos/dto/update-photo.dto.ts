import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class UpdatePhotoDto {
    @ApiProperty({example: 'changed_name'})
    @IsString()
    @MaxLength(30)
    readonly name: string;
}
