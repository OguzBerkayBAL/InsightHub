import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Llm } from './entities/llm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Llm])],
  controllers: [LlmController],
  providers: [LlmService],
})
export class LlmModule {}
