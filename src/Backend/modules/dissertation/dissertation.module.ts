import { Module } from '@nestjs/common';
import { DissertationService } from './dissertation.service';
import { DissertationController } from './dissertation.controller';
import { Dissertation } from './entities/dissertation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Dissertation])],
  controllers: [DissertationController],
  providers: [DissertationService],
})
export class DissertationModule {}
