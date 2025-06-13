import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool)
    private readonly toolRepository: Repository<Tool>
  ) {}
  async createTool(createToolDto: CreateToolDto): Promise<Tool> {
    const tool = this.toolRepository.create(createToolDto);
    return await this.toolRepository.save(tool);
  }

  async getAllTools(): Promise<Tool[]> {
    return await this.toolRepository.find();
  }

  async getToolById(id: string): Promise<Tool> {
    const tool = await this.toolRepository.findOneBy({ id });
    if (!tool) {
      throw new NotFoundException(`Tool with ID ${id} not found`);
    }
    return tool;
  }

  async updateTool(id: string, updateToolDto: UpdateToolDto): Promise<Tool> {
    const tool = await this.getToolById(id);
    Object.assign(tool, updateToolDto);
    return this.toolRepository.save(tool);
  }

  async deleteTool(id: string): Promise<void> {
    const result = await this.toolRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tool with ID ${id} not found`)
    }
  }
}
