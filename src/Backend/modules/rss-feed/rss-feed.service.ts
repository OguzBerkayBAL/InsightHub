import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Parser from 'rss-parser';
import { ArxivArticle } from './entities/arxiv-article.entity';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class RssFeedService {
    private readonly logger = new Logger(RssFeedService.name);
    private readonly parser = new Parser({
        customFields: {
            item: [
                ['dc:creator', 'creator'],
                ['dc:title', 'dcTitle'],
                ['dc:date', 'dcDate'],
            ],
        },
    });

    // arXiv kategorileri - ihtiyaca göre düzenleyebilirsiniz
    private readonly categories = [
        'cs.AI',     // Yapay Zeka
        'cs.CL',     // Hesaplamalı Dilbilim
        'cs.IR',     // Bilgi Erişimi
        'cs.LG',     // Makine Öğrenmesi
        'stat.ML',   // İstatistiksel Makine Öğrenmesi
    ];

    constructor(
        @InjectRepository(ArxivArticle)
        private arxivArticleRepository: Repository<ArxivArticle>,
    ) { }

    /**
     * Her gece 01:00'da çalışacak zamanlanmış görev
     */
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async handlePeriodicFetching() {
        this.logger.log('Başlıyor: arXiv RSS beslemeleri getiriliyor...');

        try {
            for (const category of this.categories) {
                await this.fetchArticlesForCategory(category);
            }
            this.logger.log('Tüm arXiv makaleleri başarıyla alındı ve kaydedildi.');
        } catch (error) {
            this.logger.error(`RSS besleme hatası: ${error.message}`, error.stack);
        }
    }

    /**
     * Manuel olarak RSS beslemelerini getirmek için
     */
    async fetchAllCategories() {
        const results = [];

        for (const category of this.categories) {
            const articles = await this.fetchArticlesForCategory(category);
            results.push({ category, count: articles.length });
        }

        return results;
    }

    /**
     * Belirli bir kategori için arXiv makalelerini getir
     */
    async fetchArticlesForCategory(category: string) {
        this.logger.log(`${category} kategorisi için makaleler getiriliyor...`);

        // arXiv RSS besleme URL'si
        const feedUrl = `http://export.arxiv.org/rss/${category}`;

        try {
            const feed = await this.parser.parseURL(feedUrl);
            const savedArticles = [];

            for (const item of feed.items) {
                // arXiv ID'sini URL'den çıkar
                const arxivId = this.extractArxivId(item.link);

                if (!arxivId) {
                    this.logger.warn(`Geçersiz arXiv ID: ${item.link}`);
                    continue;
                }

                // Makale zaten var mı kontrol et
                const existingArticle = await this.arxivArticleRepository.findOne({
                    where: { arxivId },
                });

                if (existingArticle) {
                    this.logger.debug(`Makale zaten mevcut: ${arxivId}`);
                    continue;
                }

                // Tarih alanlarını parse et
                const publishedDate = new Date(item.pubDate || item.dcDate || new Date());

                // Yazarları parse et
                let authors = [];
                if (item.creator) {
                    authors = Array.isArray(item.creator)
                        ? item.creator
                        : [item.creator];
                }

                // PDF bağlantısını oluştur
                const pdfLink = `${item.link.replace('abs', 'pdf')}.pdf`;

                // Yeni makale oluştur
                const newArticle = this.arxivArticleRepository.create({
                    arxivId,
                    title: item.title,
                    summary: item.content || item.contentSnippet || '',
                    authors,
                    categories: [category],
                    link: item.link,
                    pdfLink,
                    publishedDate,
                    updatedDate: publishedDate,
                });

                // Veritabanına kaydet
                const savedArticle = await this.arxivArticleRepository.save(newArticle);
                savedArticles.push(savedArticle);

                this.logger.debug(`Yeni makale kaydedildi: ${arxivId}`);
            }

            this.logger.log(`${category}: ${savedArticles.length} yeni makale kaydedildi.`);
            return savedArticles;
        } catch (error) {
            this.logger.error(`${category} için RSS besleme hatası: ${error.message}`);
            return [];
        }
    }

    /**
     * arXiv URL'sinden ID'yi çıkar
     * Örnek: https://arxiv.org/abs/2106.09685 -> 2106.09685
     */
    private extractArxivId(url: string): string | null {
        const match = url.match(/arxiv\.org\/abs\/([0-9v\.]+)/);
        return match ? match[1] : null;
    }

    async fetchByKeyword(keyword: string): Promise<{ keyword: string; count: number }> {
        const encoded = encodeURIComponent(keyword);
        const url = `http://export.arxiv.org/api/query?search_query=all:${encoded}&start=0&max_results=25`;
      
        try {
          const { data } = await axios.get(url);
          const parsed = await parseStringPromise(data);
      
          const entries = parsed.feed.entry || [];
          let savedCount = 0;
      
          for (const entry of entries) {
            const arxivId = entry.id[0].split('/abs/')[1];
      
            const exists = await this.arxivArticleRepository.findOne({ where: { arxivId } });
            if (exists) continue;
      
            const authors = entry.author.map((a) => a.name[0]);
            const title = entry.title[0].trim();
            const summary = entry.summary[0].trim();
            const publishedDate = new Date(entry.published[0]);
            const link = entry.id[0];
            const pdfLink = link.replace('/abs/', '/pdf/') + '.pdf';
      
            const newArticle = this.arxivArticleRepository.create({
              arxivId,
              title,
              summary,
              authors,
              categories: [`custom:${keyword}`], // özel kategori olarak sakla
              link,
              pdfLink,
              publishedDate,
              updatedDate: publishedDate,
            });
      
            await this.arxivArticleRepository.save(newArticle);
            savedCount++;
          }
      
          return { keyword, count: savedCount };
        } catch (error) {
          this.logger.error(`Anahtar kelime ile çekim hatası (${keyword}): ${error.message}`);
          return { keyword, count: 0 };
        }
      }

    /**
     * Tüm makaleleri getir (sayfalandırma ile)
     */
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [articles, total] = await this.arxivArticleRepository.findAndCount({
            order: { publishedDate: 'DESC' },
            skip,
            take: limit,
        });

        return {
            data: articles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * ID'ye göre makale bul
     */
    findOne(id: string) {
        return this.arxivArticleRepository.findOne({ where: { id } });
    }
} 