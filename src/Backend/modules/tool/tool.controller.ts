import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';
import { Tool } from './entities/tool.entity';

@ApiTags('Tool')
@Controller('tool')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @ApiOperation({ summary: 'Create a new Tool' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateToolDto,
    examples: {
      example1: {
        summary: 'Tool oluşturma örneği',
        value: {
          toolName: 'Tool adı',
          toolDescription: 'Tool açıklaması',
          toolLink: 'Tool Linki',
        },
      },
    },
  }) // Body'de CreateArticleDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The tool has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createTool(@Body() createToolDto: CreateToolDto): Promise<Tool> {
    return await this.toolService.createTool(createToolDto);
  }



  @Get()
  @ApiOperation({ summary: 'Get a paginated list of tools' }) // Kullanıcıları listele
  @ApiResponse({ status: 200, description: 'Paginated list of tools' })
  async getAllTools(): Promise<Tool[]> {
    return await this.toolService.getAllTools();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a Tool by ID' }) //  ID ile bul
  @ApiParam({ name: 'id', description: 'Tool ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'Tool found', type: Tool })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async getToolById(@Param('id') id: string): Promise<Tool> {
    return await this.toolService.getToolById(id);
  }

  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update Tool information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'Tool ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateToolDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The Tool has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto): Promise<Tool> {
    return this.toolService.updateTool(id, updateToolDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Tool by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'Tool ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The Tool has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async deleteTool(@Param('id') id: string): Promise<void> {
    return await this.toolService.deleteTool(id);
  }
}
