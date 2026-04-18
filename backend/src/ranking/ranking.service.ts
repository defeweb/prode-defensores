import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../scoring/score.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Score) private scoresRepo: Repository<Score>,
  ) {}

  async getGlobal(userId: number) {
    const scores = await this.scoresRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .orderBy('s.puntosAcumulados', 'DESC')
      .getMany();

    const myPos = scores.findIndex(s => s.userId === userId);

    return {
      ranking: scores.slice(0, 100).map((s, i) => ({
        posicion: i + 1,
        nombre: s.user.nombre,
        nroSocio: s.user.nroSocio,
        puntosAcumulados: s.puntosAcumulados,
        esYo: s.userId === userId,
      })),
      miPosicion: myPos >= 0 ? myPos + 1 : null,
      totalJugadores: scores.length,
    };
  }

  async getByMatchday(matchdayId: number, userId: number) {
    const scores = await this.scoresRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'u')
      .where('s.matchdayId = :matchdayId', { matchdayId })
      .orderBy('s.puntosFecha', 'DESC')
      .getMany();

    return scores.map((s, i) => ({
      posicion: i + 1,
      nombre: s.user.nombre,
      puntosFecha: s.puntosFecha,
      puntosAcumulados: s.puntosAcumulados,
      esYo: s.userId === userId,
    }));
  }
}
