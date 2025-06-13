import { PartialType } from '@nestjs/mapped-types';
import { CreateDissertationDto } from './create-dissertation.dto';

export class UpdateDissertationDto extends PartialType(CreateDissertationDto) {}
