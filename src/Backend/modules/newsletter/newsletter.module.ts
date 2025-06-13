import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { Newsletter } from './entities/newsletter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../article/entities/article.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Newsletter, Article])],
    controllers: [NewsletterController],
    providers: [NewsletterService],
})
export class NewsletterModule { } 