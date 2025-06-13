import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';

@ApiTags('Subject')
@Controller('subject')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'Create a new Subject' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateSubjectDto,
    examples: {
      example1: {
        summary: 'Example of a valid Subject',
        value: {
          title: 'Ders başlığı',
          university: 'üniversite adı',
          subjectLink: 'ders linki',
          country: 'ülke adı',
          subjectYear: 'ders yılı',
        },
      },
    },
  }) // Body'de CreateUserDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The Subject has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createSubject(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of Subject' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of Subjects' })
  async getAllSubject(): Promise<Subject[]> {
    return await this.subjectService.getAllSubject();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Subject by ID' }) // Kullanıcıyı ID ile bul
  @ApiParam({ name: 'id', description: 'Subject ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'Subject found', type: Subject })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async getSubjectById(@Param('id') id: string): Promise<Subject> {
    return await this.subjectService.getSubjectById(id);
  }

  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update Subject information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'Subject ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateSubjectDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The Subject has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    return await this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Subject by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'Subject ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The Subject has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async deleteSubject(@Param('id') id: string): Promise<void> {
    return await this.subjectService.deleteSubject(id);
  }
}
