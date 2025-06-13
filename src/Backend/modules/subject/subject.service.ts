import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async getAllSubject(): Promise<Subject[]> {
    return await this.subjectRepository.find();
  }

  async getSubjectById(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.getSubjectById(id);
    Object.assign(subject, updateSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async deleteSubject(id: string): Promise<void> {
    const result = await this.subjectRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`)
    }
  }
}
