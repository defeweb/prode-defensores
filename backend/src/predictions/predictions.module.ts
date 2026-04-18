import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { Match } from '../matches/match.entity';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TimeValidationGuard } from '../common/guards/time-validation.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction, Match])],
  controllers: [PredictionsController],
  providers: [PredictionsService, TimeValidationGuard],
  exports: [PredictionsService],
})
export class PredictionsModule {}
