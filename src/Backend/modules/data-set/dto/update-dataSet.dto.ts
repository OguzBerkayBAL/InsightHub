import { PartialType } from '@nestjs/mapped-types';
import { CreateDataSetDto } from './create-dataSet.dto';

export class UpdateDataSetDto extends PartialType(CreateDataSetDto) {}
