import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { CreatePredictionDto } from './predictions.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Prediction) private repo: Repository<Prediction>,
  ) {}

  async upsert(userId: number, dto: CreatePredictionDto): Promise<Prediction> {
    const existing = await this.repo.findOne({
      where: { userId, matchId: dto.matchId },
    });

    if (existing) {
      await this.repo.update(existing.id, {
        resultado: dto.resultado,
        golesLocal: dto.golesLocal ?? null,
        golesVisitante: dto.golesVisitante ?? null,
      });
      return this.repo.findOneOrFail({ where: { id: existing.id } });
    }

    return this.repo.save(this.repo.create({
      userId,
      matchId: dto.matchId,
      resultado: dto.resultado,
      golesLocal: dto.golesLocal ?? null,
      golesVisitante: dto.golesVisitante ?? null,
    }));
  }

  findByUser(userId: number, matchdayId?: number): Promise<Prediction[]> {
    const qb = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.match', 'm')
      .leftJoinAndSelect('m.matchday', 'md')
      .where('p.userId = :userId', { userId });

    if (matchdayId) {
      qb.andWhere('m.matchdayId = :matchdayId', { matchdayId });
    }
    return qb.orderBy('m.inicio', 'DESC').getMany();
  }

  findByMatch(matchId: number): Promise<Prediction[]> {
    return this.repo.find({ where: { matchId } });
  }
}
