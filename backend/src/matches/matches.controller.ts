import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { SyncService } from './sync.service';
import { CreateMatchDto, SetResultDto, CreateMatchdayDto } from './matches.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(
    private svc: MatchesService,
    private syncSvc: SyncService,
  ) {}

  @Get()
  findByMatchday(@Query('matchdayId', ParseIntPipe) matchdayId: number) {
    return this.svc.findByMatchday(matchdayId);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.svc.findUpcoming();
  }

  @Get('matchdays')
  findMatchdays() {
    return this.svc.findAllMatchdays();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateMatchDto) {
    return this.svc.createMatch(dto);
  }

  @Post('matchdays')
  @UseGuards(AdminGuard)
  createMatchday(@Body() dto: CreateMatchdayDto) {
    return this.svc.createMatchday(dto);
  }

  @Put(':id/result')
  @UseGuards(AdminGuard)
  setResult(@Param('id', ParseIntPipe) id: number, @Body() dto: SetResultDto) {
    return this.svc.setResult(id, dto);
  }

  @Post('sync')
  @UseGuards(AdminGuard)
  syncResultados() {
    return this.syncSvc.syncResultados();
  }
}
