import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    DOI: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    @Column({ nullable: true })
    archiveLink: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    publicationDate: Date;

}
