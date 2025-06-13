import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { RssFeedService } from './rss-feed.service';

@Injectable()
@Command({ name: 'fetch-arxiv-feeds', description: 'arXiv makale beslemelerini manuel olarak getir' })
export class FetchArxivFeedsCommand extends CommandRunner {
    constructor(private readonly rssFeedService: RssFeedService) {
        super();
    }

    async run(): Promise<void> {
        console.log('arXiv makalelerini getirme süreci başlatılıyor...');

        try {
            const results = await this.rssFeedService.fetchAllCategories();

            console.log('Besleme getirme işlemi tamamlandı:');
            for (const result of results) {
                console.log(`- ${result.category}: ${result.count} yeni makale`);
            }

            console.log('Toplam:', results.reduce((sum, item) => sum + item.count, 0), 'yeni makale');
        } catch (error) {
            console.error('Besleme getirme hatası:', error.message);
        }
    }
} 