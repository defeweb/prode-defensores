import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { Matchday } from './matchday.entity';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { SyncService } from './sync.service';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Matchday]),
    ScoringModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService, SyncService],
  exports: [MatchesService],
})
export class MatchesModule {}
