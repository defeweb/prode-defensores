import { Controller, Post, Get, Body, Req, Query, UseGuards } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './predictions.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TimeValidationGuard } from '../common/guards/time-validation.guard';
import { Match } from '../matches/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('predictions')
@UseGuards(JwtAuthGuard)
export class PredictionsController {
  constructor(private svc: PredictionsService) {}

  @Post()
  @UseGuards(TimeValidationGuard)
  upsert(@Req() req, @Body() dto: CreatePredictionDto) {
    return this.svc.upsert(req.user.id, dto);
  }

  @Get('me')
  myPredictions(@Req() req, @Query('matchdayId') matchdayId?: string) {
    return this.svc.findByUser(req.user.id, matchdayId ? +matchdayId : undefined);
  }
}
