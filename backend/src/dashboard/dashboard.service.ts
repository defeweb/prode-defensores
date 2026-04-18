import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from '../predictions/prediction.entity';
import { Score } from '../scoring/score.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Prediction) private predsRepo: Repository<Prediction>,
    @InjectRepository(Score)      private scoresRepo: Repository<Score>,
  ) {}

  async getMyStats(userId: number) {
    const preds = await this.predsRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.match', 'm')
      .where('p.userId = :userId', { userId })
      .andWhere('m.estado = :estado', { estado: 'finalizado' })
      .getMany();

    const aciertos = preds.filter(p => p.puntosObtenidos > 0);
    const exactos  = preds.filter(p => p.puntosObtenidos >= 3);

    const scoresPorFecha = await this.scoresRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.matchday', 'md')
      .where('s.userId = :userId', { userId })
      .orderBy('s.puntosFecha', 'DESC')
      .getMany();

    const miScore = await this.scoresRepo.findOne({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    return {
      puntosAcumulados:   miScore?.puntosAcumulados ?? 0,
      posicionGlobal:     miScore?.posicion ?? null,
      totalPredicciones:  preds.length,
      porcentajeAciertos: preds.length
        ? Math.round((aciertos.length / preds.length) * 100)
        : 0,
      totalExactos: exactos.length,
      mejorFecha: scoresPorFecha[0]
        ? { numero: scoresPorFecha[0].matchday.numero, pts: scoresPorFecha[0].puntosFecha }
        : null,
      historicoFechas: scoresPorFecha.map(s => ({
        fecha: s.matchday.numero,
        pts: s.puntosFecha,
      })),
    };
  }
}
