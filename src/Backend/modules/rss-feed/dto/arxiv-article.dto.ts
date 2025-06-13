import { ApiProperty } from '@nestjs/swagger';

export class ArxivArticleDto {
    @ApiProperty({ description: 'Benzersiz UUID' })
    id: string;

    @ApiProperty({ description: 'arXiv makale ID' })
    arxivId: string;

    @ApiProperty({ description: 'Makale başlığı' })
    title: string;

    @ApiProperty({ description: 'Özet' })
    summary: string;

    @ApiProperty({ description: 'Yazarlar', type: [String] })
    authors: string[];

    @ApiProperty({ description: 'Kategoriler', type: [String] })
    categories: string[];

    @ApiProperty({ description: 'arXiv makale linki' })
    link: string;

    @ApiProperty({ description: 'PDF indirme linki' })
    pdfLink: string;

    @ApiProperty({ description: 'Yayınlanma tarihi' })
    publishedDate: Date;

    @ApiProperty({ description: 'Güncellenme tarihi' })
    updatedDate: Date;

    @ApiProperty({ description: 'Oluşturulma tarihi' })
    createdAt: Date;

    @ApiProperty({ description: 'Güncellenme tarihi' })
    updatedAt: Date;
}

export class PaginatedArxivArticlesResponseDto {
    @ApiProperty({ type: [ArxivArticleDto] })
    data: ArxivArticleDto[];

    @ApiProperty({
        description: 'Sayfalandırma meta verileri',
        example: {
            total: 100,
            page: 1,
            limit: 10,
            totalPages: 10,
        },
    })
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export class FetchResultDto {
    @ApiProperty({ description: 'Kategori', example: 'cs.AI' })
    category: string;

    @ApiProperty({ description: 'Kaydedilen makale sayısı', example: 10 })
    count: number;
} 