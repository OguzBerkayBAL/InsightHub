import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDissertationDto } from './dto/create-dissertation.dto';
import { UpdateDissertationDto } from './dto/update-dissertation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dissertation } from './entities/dissertation.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DissertationService {
  constructor(
    @InjectRepository(Dissertation)
    private readonly dissertationRepository: Repository<Dissertation>,
  ) {}

  async createDissertation(createDissertationDto: CreateDissertationDto): Promise<Dissertation> {
    const dissertation = this.dissertationRepository.create(createDissertationDto);
    return await this.dissertationRepository.save(dissertation);
  }

  async getAllDissertation(): Promise<Dissertation[]> {
    return await this.dissertationRepository.find();
  }

  async getDissertationById(id: string): Promise<Dissertation> {
    const dissertation = await this.dissertationRepository.findOneBy({ id });
    if (!dissertation) {
      throw new NotFoundException(`Dissertation with ID ${id} not found`);
    }
    return dissertation;
  }

  async updateDissertation(id: string, updateDissertationDto: UpdateDissertationDto): Promise<Dissertation> {
    const dissertation = await this.getDissertationById(id);
    Object.assign(dissertation, updateDissertationDto);
    return this.dissertationRepository.save(dissertation);
  }

  async deleteDissertation(id: string): Promise<void> {
    const result = await this.dissertationRepository.softDelete(id);
    if (result.affected ===0) {
      throw new NotFoundException(`Dissertation with ID ${id} not found`);
    }
  }
}
