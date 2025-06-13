import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DataSetService } from './dataSet.service';
import { CreateDataSetDto } from './dto/create-dataSet.dto';
import { UpdateDataSetDto } from './dto/update-dataSet.dto';
import { DataSet } from './entities/data-set.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';

@ApiTags('Data-Set')
@Controller('dataSet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataSetController {
  constructor(private readonly dataSetService: DataSetService) {}

  @ApiOperation({ summary: 'Create a new dataSet' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateDataSetDto,
    examples: {
      example1: {
        summary: 'Data-Set oluşturma örneği',
        value: {
          datasetName: 'Data-set adı',
          datasetLink: 'Data-set linki',
          datasetDescription: 'Data-set açıklaması',
          datasetType: 'Data-set tipi',
          datasetYear: 'Data-set yılı',
          datasetFormat: 'Data-set formatı adı',
          language: 'Data-set dil adı',
          size: 'Size',
          license: 'Lisans adı',
        },
      },
    },
  }) // Body'de CreatedataSetDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The dataSet has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createDataSet(
    @Body() createDataSetDto: CreateDataSetDto,
  ): Promise<DataSet> {
    return await this.dataSetService.createDataSet(createDataSetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of dataSets' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of dataSets' })
  async getAllDataSets(): Promise<DataSet[]> {
    return await this.dataSetService.getAllDataSets();
  }

  // ID'ye göre makale getir
  @Get(':id')
  @ApiOperation({ summary: 'Find a dataSet by ID' }) //  ID ile bul
  @ApiParam({ name: 'id', description: 'dataSet ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'dataSet found', type: DataSet })
  @ApiResponse({ status: 404, description: 'dataSet not found' })
  async getDataSetById(@Param('id') id: string): Promise<DataSet> {
    return await this.dataSetService.getDataSetById(id);
  }

  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update dataSet information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'dataSet ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateDataSetDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The dataSet has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'dataSet not found' })
  async updateDataSet(
    @Param('id') id: string,
    @Body() updateDataSetDto: UpdateDataSetDto,
  ): Promise<DataSet> {
    return await this.dataSetService.updateDataSet(id, updateDataSetDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dataSet by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'dataSet ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The dataSet has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'dataSet not found' })
  async deleteDataSet(@Param('id') id: string): Promise<void> {
    return await this.dataSetService.deleteDataSet(id);
  }
}
