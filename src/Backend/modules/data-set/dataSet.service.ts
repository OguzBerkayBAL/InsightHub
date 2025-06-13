import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDataSetDto } from './dto/create-dataSet.dto';
import { UpdateDataSetDto } from './dto/update-dataSet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSet } from './entities/data-set.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataSetService {
  constructor(
    @InjectRepository(DataSet)
    private readonly dataSetRepository: Repository<DataSet>,
  ) {}
  async createDataSet(createDataSetDto: CreateDataSetDto): Promise<DataSet> {
    const dataSet = this.dataSetRepository.create(createDataSetDto);
    return await this.dataSetRepository.save(dataSet);
  }

  async getAllDataSets(): Promise<DataSet[]> {
    return await this.dataSetRepository.find();
  }

  async getDataSetById(id: string): Promise<DataSet> {
    const dataSet = await this.dataSetRepository.findOneBy({ id });
    if (!dataSet) {
      throw new NotFoundException(`Data-Set with ID ${id} not found`);
    }
    return dataSet;
  }

  async updateDataSet(id: string, updateDataSetDto: UpdateDataSetDto): Promise<DataSet> {
    const dataSet = await this.getDataSetById(id);
    Object.assign(dataSet, updateDataSetDto);
    return this.dataSetRepository.save(dataSet);
  }

  async deleteDataSet(id: string): Promise<void> {
    const result = await this.dataSetRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Data-set with ID ${id} not found`);
    }
  }
}
