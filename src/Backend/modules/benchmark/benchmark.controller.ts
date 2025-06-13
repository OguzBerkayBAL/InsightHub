import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { CreateBenchmarkDto } from './dto/create-benchmark.dto';
import { UpdateBenchmarkDto } from './dto/update-benchmark.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';
import { Benchmark } from './entities/benchmark.entity';

@ApiTags('Benchmark')
@Controller('benchmark')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @ApiOperation({ summary: 'Create a new Benchmark' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateBenchmarkDto,
    examples: {
      example1: {
        summary: 'Yeni Benchmark oluşturma örneği',
        value: {
          benchmarkName: 'Benchmark adı',
          benchmarkYear: 'Benchmark yılı',
          benchmarkDescription: 'Benchmark Açıklaması',
          benchmarkLink: 'Benchmark Linki',
          benchmarkType: 'Benchmark tipi',
        },
      },
    },
  }) // Body'de CreateUserDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The Benchmark has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createBenchmark(@Body() createBenchmarkDto: CreateBenchmarkDto): Promise<Benchmark> {
    return await this.benchmarkService.createBenchmark(createBenchmarkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of Benchmarks' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of Benchmark' })
  async getAllBenchmarks(): Promise<Benchmark[]> {
    return await this.benchmarkService.getAllBenchmarks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Benchmark by ID' }) // Kullanıcıyı ID ile bul
  @ApiParam({ name: 'id', description: 'Benchmark ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'Benchmark found', type: Benchmark })
  @ApiResponse({ status: 404, description: 'Benchmark not found' })
  async getBenchmarkById(@Param('id') id: string): Promise<Benchmark> {
    return await this.benchmarkService.getBenchmarkById(id);
  }

  @Roles('admin', 'user')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Benchmark information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'Benchmark ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateBenchmarkDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The Benchmark has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Benchmark not found' })
  async updateBenchmark(@Param('id') id: string, @Body() updateBenchmarkDto: UpdateBenchmarkDto): Promise<Benchmark> {
    return await this.benchmarkService.updateBenchmark(id, updateBenchmarkDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Benchmark by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'Benchmark ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The Benchmark has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteBenchmark(@Param('id') id: string): Promise<void> {
    return await this.benchmarkService.deleteBenchmark(id);
  }
}
