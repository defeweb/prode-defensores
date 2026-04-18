import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../matches/match.entity';

@Injectable()
export class TimeValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(Match) private matchesRepo: Repository<Match>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const matchId = req.body?.matchId;

    const match = await this.matchesRepo.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Partido no encontrado');

    if (new Date() >= new Date(match.inicio)) {
      throw new ForbiddenException('El partido ya comenzó, no podés modificar tu predicción');
    }
    return true;
  }
}
