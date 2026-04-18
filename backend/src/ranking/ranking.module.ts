import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from '../scoring/score.entity';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
