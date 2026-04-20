import { Controller, Get, Put, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get('pending')
  getPending() {
    return this.svc.findPending();
  }

  @Get()
  getAll() {
    return this.svc.findAll();
  }

  @Put(':id/aprobar')
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.aprobar(id);
  }

  @Put(':id/desactivar')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.desactivar(id);
  }
}
