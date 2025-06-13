import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DissertationService } from './dissertation.service';
import { CreateDissertationDto } from './dto/create-dissertation.dto';
import { UpdateDissertationDto } from './dto/update-dissertation.dto';
import { Dissertation } from './entities/dissertation.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';

@ApiTags('Dissertation')
@Controller('dissertation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DissertationController {
  constructor(private readonly dissertationService: DissertationService) {}

  @ApiOperation({ summary: 'Create a new Dissertation' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateDissertationDto,
    examples: {
      example1: {
        summary: 'Tez Örneği Bu Şekilde Girilmeli',
        value: {
          title: 'Tez Başlığı',
          author: 'Yazar Adı',
          dissertationType: 'Tez Türü',
          dissertationLink: 'Tez Linki',
          university: 'Üniversite Adı',
          country: 'Ülke Adı',
          publicationDate: 'Yayın Tarihi',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The Dissertation has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createDissertation(@Body() createDissertationDto: CreateDissertationDto): Promise<Dissertation> {
    return await this.dissertationService.createDissertation(createDissertationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of Dissertation' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of Dissertations' })
  async getAllDissertation(): Promise<Dissertation[]> {
    return await this.dissertationService.getAllDissertation();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Dissertation by ID' }) // Kullanıcıyı ID ile bul
  @ApiParam({ name: 'id', description: 'Dissertation ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'Dissertation found', type: Dissertation })
  @ApiResponse({ status: 404, description: 'Dissertation not found' })
  async getDissertationById(@Param('id') id: string): Promise<Dissertation> {
    return await this.dissertationService.getDissertationById(id);
  }

  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update Dissertation information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'Dissertation ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateDissertationDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The Dissertation has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Dissertation not found' })
  async updateDissertation(@Param('id') id: string, @Body() updateDissertationDto: UpdateDissertationDto): Promise<Dissertation> {
    return await this.dissertationService.updateDissertation(id, updateDissertationDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Dissertation by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'Dissertation ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The Dissertation has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Dissertation not found' })
  async deleteDissertation(@Param('id') id: string): Promise<void> {
    return await this.dissertationService.deleteDissertation(id);
  }
}
