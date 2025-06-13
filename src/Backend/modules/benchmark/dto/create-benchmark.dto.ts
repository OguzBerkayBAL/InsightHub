import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateBenchmarkDto {
    @IsString()
    @IsNotEmpty()
   
    benchmarkName: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    benchmarkYear: Date;

    @IsString()
    @IsNotEmpty()
    benchmarkDescription: string;

    @IsString()
    @IsNotEmpty()
    benchmarkLink: string;

    @IsString()
    @IsNotEmpty()
    benchmarkType: string;
}
