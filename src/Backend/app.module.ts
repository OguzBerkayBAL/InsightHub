import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { DissertationModule } from './modules/dissertation/dissertation.module';
import { SubjectModule } from './modules/subject/subject.module';
import { ToolModule } from './modules/tool/tool.module';
import { LlmModule } from './modules/llm/llm.module';
import { DataSetModule } from './modules/data-set/dataSet.module';
import { BenchmarkModule } from './modules/benchmark/benchmark.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './modules/article/entities/article.entity';
import { UserModule } from './modules/user/user.module';
import { GoogleStrategy } from './common/auth/jwt/googleStrategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './common/auth/auth.module';
import { Benchmark } from './modules/benchmark/entities/benchmark.entity';
import { Dissertation } from 'modules/dissertation/entities/dissertation.entity';
import { DataSet } from 'modules/data-set/entities/data-set.entity';
import { Tool } from 'modules/tool/entities/tool.entity';
import { Llm } from 'modules/llm/entities/llm.entity';
import { Subject } from 'modules/subject/entities/subject.entity';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { Newsletter } from './modules/newsletter/entities/newsletter.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RssFeedModule } from './modules/rss-feed/rss-feed.module';
import { ArxivArticle } from './modules/rss-feed/entities/arxiv-article.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ArticleModule,
    DissertationModule,
    JwtModule,
    SubjectModule,
    ToolModule,
    LlmModule,
    DataSetModule,
    BenchmarkModule,
    NewsletterModule,
    RssFeedModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Article, User, Benchmark, Dissertation, DataSet, Tool, Llm, Subject, Newsletter, ArxivArticle],
      synchronize: true,
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule { }
