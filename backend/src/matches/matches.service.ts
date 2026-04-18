import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Matchday } from './matchday.entity';
import { CreateMatchDto, SetResultDto, CreateMatchdayDto } from './matches.dto';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectRepository(Match)    private matchesRepo: Repository<Match>,
    @InjectRepository(Matchday) private matchdaysRepo: Repository<Matchday>,
    private scoringService: ScoringService,
  ) {}

  createMatchday(dto: CreateMatchdayDto) {
    return this.matchdaysRepo.save(this.matchdaysRepo.create(dto));
  }

  findAllMatchdays() {
    return this.matchdaysRepo.find({ order: { numero: 'DESC' } });
  }

  createMatch(dto: CreateMatchDto) {
    return this.matchesRepo.save(this.matchesRepo.create({
      matchdayId: dto.matchdayId,
      equipoLocal: dto.equipoLocal,
      equipoVisitante: dto.equipoVisitante,
      inicio: new Date(dto.inicio),
    }));
  }

  findByMatchday(matchdayId: number) {
    return this.matchesRepo.find({ where: { matchdayId }, order: { inicio: 'ASC' } });
  }

  async findById(id: number) {
    const match = await this.matchesRepo.findOne({ where: { id }, relations: ['matchday'] });
    if (!match) throw new NotFoundException('Partido no encontrado');
    return match;
  }

  async setResult(id: number, dto: SetResultDto) {
    await this.matchesRepo.update(id, {
      golesLocal: dto.golesLocal,
      golesVisitante: dto.golesVisitante,
      estado: 'finalizado',
    });

    const match = await this.findById(id);

    // Pasar solo el ID — el scoring lee el partido fresco desde la DB
    setImmediate(() => {
      this.scoringService.calculateForMatch(id).catch(err =>
        this.logger.error('Error en scoring', err),
      );
    });

    return match;
  }

  findUpcoming() {
    return this.matchesRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.matchday', 'md')
      .where('m.inicio > :now', { now: new Date() })
      .andWhere('m.estado = :estado', { estado: 'pendiente' })
      .orderBy('m.inicio', 'ASC')
      .take(10)
      .getMany();
  }
}
