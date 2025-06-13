import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ARTICLE_PAGINATION_CONFIG } from './paginate-config/article-paginate-config';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}
  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);
    return await this.articleRepository.save(article);
  }

  async getAllArticles(query: PaginateQuery): Promise<Paginated<Article>> {
    return await paginate(
      query,
      this.articleRepository,
      ARTICLE_PAGINATION_CONFIG,
    );
  }

  async getArticleById(id: string): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.getArticleById(id);
    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async deleteArticle(id: string): Promise<void> {
    const result = await this.articleRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }
}
