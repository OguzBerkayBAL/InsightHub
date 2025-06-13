import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'common/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'common/auth/jwt/roles.guard';
import { Roles } from 'roles.decorator';
import { ApiPaginationQuery, Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ARTICLE_PAGINATION_CONFIG } from './paginate-config/article-paginate-config';
import { query } from 'express';

@ApiTags('Article')
@Controller('article')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Yeni bir makale oluştur
  @ApiOperation({ summary: 'Create a new Article' }) // Endpoint'in amacını açıklıyoruz
  @ApiBody({
    type: CreateArticleDto,
    examples: {
      example1: {
        summary: 'Makale oluşturma örneği',
        value: {
          title: 'Makale Basliği',
          author: 'Yazar Ismi',
          DOI: 'Örneğin bir DOI şu şekilde görünebilir: 10.1000/xyz123',
          summary: 'Özet değerinde bir yazı.',
          archiveLink: 'Arşivin linki',
          category: 'Kategori Örneği',
          publicationDate: 'Makalenin yayın tarihi',
        },
      },
    },
  }) // Body'de CreateArticleDto bekleniyor
  @ApiResponse({
    status: 201,
    description: 'The Article has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles('admin')
  @Post()
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return await this.articleService.createArticle(createArticleDto);
  }

  @Get()
  @ApiPaginationQuery(ARTICLE_PAGINATION_CONFIG)
  @ApiOperation({ summary: 'Get a paginated list of Articles' })
  @ApiResponse({ status: 200, description: 'Paginated list of Articles' })
  async getAllArticles(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Article>> {
    return await this.articleService.getAllArticles(query);
  }


  // ID'ye göre makale getir
  @Get(':id')
  @ApiOperation({ summary: 'Find a Article by ID' }) //  ID ile bul
  @ApiParam({ name: 'id', description: 'Article ID' }) // URL'deki id parametresi
  @ApiResponse({ status: 200, description: 'Article found', type: Article })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async getArticleById(@Param('id') id: string): Promise<Article> {
    return await this.articleService.getArticleById(id);
  }

  // Makaleyi günc2elle
  @Roles('admin', 'user')
  @Put(':id')
  @ApiOperation({ summary: 'Update Article information by ID' }) // Kullanıcı güncelleme
  @ApiParam({ name: 'id', description: 'Article ID' }) // URL'deki id parametresi
  @ApiBody({ type: UpdateArticleDto }) // Body'de UpdateUserDto bekleniyor
  @ApiResponse({
    status: 200,
    description: 'The Article has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.articleService.updateArticle(id, updateArticleDto);
  }

  // Makaleyi sil
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Article by ID' }) // Kullanıcıyı sil
  @ApiParam({ name: 'id', description: 'Article ID' }) // URL'deki id parametresi
  @ApiResponse({
    status: 200,
    description: 'The Article has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async deleteArticle(@Param('id') id: string): Promise<void> {
    return await this.articleService.deleteArticle(id);
  }
}
