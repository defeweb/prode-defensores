import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoringRules } from './scoring-rules.entity';
import { Prediction } from '../predictions/prediction.entity';
import { Match } from '../matches/match.entity';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Score, ScoringRules, Prediction, Match])],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
