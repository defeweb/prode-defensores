import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private svc: DashboardService) {}

  @Get('me')
  getMyDashboard(@Req() req) {
    return this.svc.getMyStats(req.user.id);
  }
}
