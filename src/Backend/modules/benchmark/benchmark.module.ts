import { Module } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { BenchmarkController } from './benchmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benchmark } from './entities/benchmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benchmark])],
  controllers: [BenchmarkController],
  providers: [BenchmarkService],
})
export class BenchmarkModule {}
