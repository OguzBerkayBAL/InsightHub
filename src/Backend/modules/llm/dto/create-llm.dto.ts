import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateLlmDto {
    @IsString()
    @IsNotEmpty()
    llmName: string;

    @IsString()
    @IsNotEmpty()
    llmLink: string;

    @IsString()
    @IsNotEmpty()
    llmDescription: string;

    @IsString()
    @IsNotEmpty()
    llmType: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    llmYear: Date;

    @IsString()
    @IsNotEmpty()
    parametersNumber: string;

    @IsString()
    @IsNotEmpty()
    license: string;
}
