import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBenchmarkDto } from './dto/create-benchmark.dto';
import { UpdateBenchmarkDto } from './dto/update-benchmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Benchmark } from './entities/benchmark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BenchmarkService {
  constructor(
    @InjectRepository(Benchmark)
    private readonly benchmarkRepository: Repository<Benchmark>
  ) {}

  async createBenchmark(createBenchmarkDto: CreateBenchmarkDto): Promise<Benchmark> {
    const benchmark = this.benchmarkRepository.create(createBenchmarkDto);
    return await this.benchmarkRepository.save(benchmark);
  }

  async getAllBenchmarks(): Promise<Benchmark[]> {
    return await this.benchmarkRepository.find();
  }

  async getBenchmarkById(id: string): Promise<Benchmark> {
    const benchmark = await this.benchmarkRepository.findOneBy({ id });
    if (!benchmark) {
      throw new NotFoundException(`Benchmark with ID ${id} not found`);
    }
    return benchmark;
  }

  async updateBenchmark(id: string, updateBenchmarkDto: UpdateBenchmarkDto): Promise<Benchmark> {
    const benchmark = await this.getBenchmarkById(id);
    Object.assign(benchmark, updateBenchmarkDto);
    return this.benchmarkRepository.save(benchmark);
  }

  async deleteBenchmark(id: string): Promise<void> {
    const result = await this.benchmarkRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Benchmark with ID ${id} not found`);
    }
  }
}
