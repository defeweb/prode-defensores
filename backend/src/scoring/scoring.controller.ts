import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { IsNumber, Min } from 'class-validator';

class UpdateRulesDto {
  @IsNumber() @Min(0) ptsResultado: number;
  @IsNumber() @Min(0) ptsExacto: number;
}

@Controller('scoring')
@UseGuards(JwtAuthGuard)
export class ScoringController {
  constructor(private svc: ScoringService) {}

  @Get('rules')
  getRules() {
    return this.svc.getRules();
  }

  @Put('rules')
  @UseGuards(AdminGuard)
  updateRules(@Body() dto: UpdateRulesDto) {
    return this.svc.updateRules(dto.ptsResultado, dto.ptsExacto);
  }
}
