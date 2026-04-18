import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ranking')
@UseGuards(JwtAuthGuard)
export class RankingController {
  constructor(private svc: RankingService) {}

  @Get('global')
  getGlobal(@Req() req) {
    return this.svc.getGlobal(req.user.id);
  }

  @Get('matchday/:id')
  getByMatchday(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.svc.getByMatchday(id, req.user.id);
  }
}
