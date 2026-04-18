import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from '../predictions/prediction.entity';
import { Score } from '../scoring/score.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction, Score])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
