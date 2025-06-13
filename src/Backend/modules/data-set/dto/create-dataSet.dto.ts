import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateDataSetDto {
    @IsString()
    @IsNotEmpty()
    datasetName: string;

    @IsString()
    @IsNotEmpty()
    datasetLink: string;

    @IsString()
    @IsNotEmpty()
    datasetDescription: string;

    @IsString()
    @IsNotEmpty()
    datasetType: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    datasetYear: Date;

    @IsString()
    @IsNotEmpty()
    datasetFormat: string;

    @IsString()
    @IsNotEmpty()
    language: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsNotEmpty()
    license: string;
}
