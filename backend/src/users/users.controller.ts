import { Controller, Get, Put, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UpdateProfileDto } from './profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.svc.findById(req.user.id);
  }

  @Put('me')
  updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.svc.updateProfile(req.user.id, dto);
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  getPending() {
    return this.svc.findPending();
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.svc.findAll();
  }

  @Put(':id/aprobar')
  @UseGuards(AdminGuard)
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.aprobar(id);
  }

  @Put(':id/desactivar')
  @UseGuards(AdminGuard)
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.svc.desactivar(id);
  }
}
