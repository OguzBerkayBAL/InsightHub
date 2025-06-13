import { Module } from '@nestjs/common';
import { DataSetService } from './dataSet.service';
import { DataSetController } from './dataSet.controller';
import { DataSet } from './entities/data-set.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DataSet])],
  controllers: [DataSetController],
  providers: [DataSetService],
})
export class DataSetModule {}
