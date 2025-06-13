import { Controller, Get, Param, Query, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RssFeedService } from './rss-feed.service';
import { Public } from '../../public.decorator';
import { ArxivArticleDto, FetchResultDto, PaginatedArxivArticlesResponseDto } from './dto/arxiv-article.dto';

@ApiTags('rss-feed')
@Controller('rss-feed')
export class RssFeedController {
    constructor(private readonly rssFeedService: RssFeedService) { }

    @Public()
    @Get('articles')
    @ApiOperation({ summary: 'arXiv makalelerini getir' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Sayfalandırılmış makaleler',
        type: PaginatedArxivArticlesResponseDto
    })
    findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.rssFeedService.findAll(+page, +limit);
    }

    @Public()
    @Get('articles/:id')
    @ApiOperation({ summary: 'ID\'ye göre arXiv makalesi getir' })
    @ApiResponse({
        status: 200,
        description: 'Bulunan makale',
        type: ArxivArticleDto
    })
    @ApiResponse({ status: 404, description: 'Makale bulunamadı' })
    findOne(@Param('id') id: string) {
        return this.rssFeedService.findOne(id);
    }

    @Public()
    @Post('fetch-keyword')
    @ApiOperation({ summary: 'Anahtar kelimeye göre arXiv makalelerini getir' })
    @ApiQuery({ name: 'keyword', required: true, type: String })
    @ApiResponse({
        status: 200,
        description: 'Kaç yeni makale kaydedildi',
    })
    fetchByKeyword(@Query('keyword') keyword: string) {
        if (!keyword) {
            throw new BadRequestException('Anahtar kelime belirtilmelidir.');
        }
        return this.rssFeedService.fetchByKeyword(keyword);
    }

    @Public()
    @Post('fetch')
    @ApiOperation({ summary: 'Manuel olarak RSS beslemelerini getir' })
    @ApiResponse({
        status: 200,
        description: 'Getirilen beslemeler hakkında özet bilgi',
        type: [FetchResultDto]
    })
    fetchFeeds() {
        return this.rssFeedService.fetchAllCategories();
    }
} 