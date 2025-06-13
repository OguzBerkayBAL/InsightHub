import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { LlmService } from './llm.service';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';
import { Llm } from './entities/llm.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';

@ApiTags('Llm')
@Controller('llm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @ApiOperation({ summary: 'Create a new llm' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateLlmDto,
    examples: {
      example1: {
        summary: 'Llm oluşturma örneği',
        value: {
          llmName: 'llm adı',
          llmLink: 'llm linki',
          llmDescription: 'llm açıklaması',
          llmType: 'llm tipi',
          llmYear: 'llm yılı',
          parametersNumber: 'parametre numarası',
          license: 'lisans gir',
        },
      },
    },
  }) // Body'de CreatellmDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The llm has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createLlm(
    @Body() createLlmDto: CreateLlmDto,
  ): Promise<Llm> {
    return await this.llmService.createLlm(createLlmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of Llms' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of Llms' })
  async getAllLlms(): Promise<Llm[]> {
    return await this.llmService.getAllLlms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a llm by ID' }) //  ID ile bul
  @ApiParam({ name: 'id', description: 'llm ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'llm found', type: Llm })
  @ApiResponse({ status: 404, description: 'llm not found' })
  async getLlmById(@Param('id') id: string): Promise<Llm> {
    return await this.llmService.getLlmById(id);
  }

  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update llm information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'llm ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateLlmDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The llm has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'llm not found' })
  async updateLlm(
    @Param('id') id: string,
    @Body() updateLlmDto: UpdateLlmDto,
  ): Promise<Llm> {
    return await this.llmService.updateLlm(id, updateLlmDto);
  }

  // Makaleyi sil
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a llm by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'llm ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The llm has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'llm not found' })
  async deleteLlm(@Param('id') id: string): Promise<void> {
    return await this.llmService.deleteLlm(id);
  }
}
