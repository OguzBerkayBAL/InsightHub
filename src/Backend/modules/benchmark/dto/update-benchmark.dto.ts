import { PartialType } from '@nestjs/mapped-types';
import { CreateBenchmarkDto } from './create-benchmark.dto';

export class UpdateBenchmarkDto extends PartialType(CreateBenchmarkDto) {}
