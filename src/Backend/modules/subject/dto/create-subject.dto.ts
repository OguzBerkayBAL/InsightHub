import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  subjectLink: string;

  @IsString()
  @IsNotEmpty()
  country: string;
 
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  subjectYear: Date;
}
