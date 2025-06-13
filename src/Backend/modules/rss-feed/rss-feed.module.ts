import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RssFeedService } from './rss-feed.service';
import { RssFeedController } from './rss-feed.controller';
import { ArxivArticle } from './entities/arxiv-article.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArxivArticle]),
        ScheduleModule.forRoot(),
    ],
    controllers: [RssFeedController],
    providers: [RssFeedService],
    exports: [RssFeedService],
})
export class RssFeedModule { } 