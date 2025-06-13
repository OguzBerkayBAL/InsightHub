import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';
import { Llm } from './entities/llm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LlmService {
  constructor(
    @InjectRepository(Llm)
    private readonly llmRepository: Repository<Llm>
  ) {}

  async createLlm(createllmDto: CreateLlmDto): Promise<Llm> {
    const llm = this.llmRepository.create(createllmDto);
    return await this.llmRepository.save(llm);
  }

  async getAllLlms(): Promise<Llm[]> {
    return await this.llmRepository.find();
  }

  async getLlmById(id: string): Promise<Llm> {
    const llm = await this.llmRepository.findOneBy({ id });
    if (!llm) {
      throw new NotFoundException(`llm with ID ${id} not found`);
    }
    return llm;
  }

  async updateLlm(id: string, updatellmDto: UpdateLlmDto): Promise<Llm> {
    const llm = await this.getLlmById(id);
    Object.assign(llm, updatellmDto);
    return this.llmRepository.save(llm);
  }

  async deleteLlm(id: string): Promise<void> {
    const result = await this.llmRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Llm with ID ${id} not found`);
    }
  }
}
