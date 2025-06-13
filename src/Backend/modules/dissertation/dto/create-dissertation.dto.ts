import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateDissertationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    dissertationType: string;

    @IsString()
    @IsNotEmpty()
    dissertationLink: string;

    @IsString()
    @IsNotEmpty()
    university: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    publicationDate: Date;

}
