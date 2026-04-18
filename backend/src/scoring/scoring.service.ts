import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from '../predictions/prediction.entity';
import { Score } from './score.entity';
import { ScoringRules } from './scoring-rules.entity';
import { Match } from '../matches/match.entity';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    @InjectRepository(Prediction)   private predsRepo: Repository<Prediction>,
    @InjectRepository(Score)        private scoresRepo: Repository<Score>,
    @InjectRepository(ScoringRules) private rulesRepo: Repository<ScoringRules>,
    @InjectRepository(Match)        private matchesRepo: Repository<Match>,
  ) {}

  async calculateForMatch(matchId: number): Promise<void> {
    this.logger.log('Calculando puntos para partido ' + matchId);

    // Leer el partido directamente desde el repo para tener datos frescos
    const match = await this.matchesRepo.findOne({
      where: { id: matchId },
      relations: ['matchday'],
    });

    if (!match) { this.logger.warn('Partido no encontrado: ' + matchId); return; }
    if (match.golesLocal === null || match.golesVisitante === null) {
      this.logger.warn('Partido sin resultado: ' + matchId); return;
    }

    const rules = await this.rulesRepo.findOne({ where: { activa: true } });
    if (!rules) { this.logger.warn('No hay reglas activas'); return; }

    const predictions = await this.predsRepo.find({ where: { matchId: match.id } });
    this.logger.log('Predicciones a procesar: ' + predictions.length);

    for (const pred of predictions) {
      const pts = this.computePoints(pred, match, rules);
      this.logger.log('Usuario ' + pred.userId + ' -> ' + pts + ' pts');
      await this.predsRepo.update(pred.id, { puntosObtenidos: pts });
    }

    await this.recalculateScores(match.matchdayId);
    this.logger.log('Scoring completado para partido ' + matchId);
  }

  private computePoints(pred: Prediction, match: Match, rules: ScoringRules): number {
    const realResult = this.getResult(match.golesLocal!, match.golesVisitante!);
    if (pred.resultado !== realResult) return 0;

    const exacto =
      pred.golesLocal === match.golesLocal &&
      pred.golesVisitante === match.golesVisitante;

    return exacto ? rules.ptsExacto : rules.ptsResultado;
  }

  private getResult(golesL: number, golesV: number): string {
    if (golesL > golesV) return 'L';
    if (golesL < golesV) return 'V';
    return 'E';
  }

  private async recalculateScores(matchdayId: number): Promise<void> {
    const totalesFecha = await this.predsRepo
      .createQueryBuilder('p')
      .select('p.user_id', 'userId')
      .addSelect('SUM(p.puntosObtenidos)', 'puntosFecha')
      .innerJoin('p.match', 'm')
      .where('m.matchday_id = :matchdayId', { matchdayId })
      .groupBy('p.user_id')
      .getRawMany();

    for (const row of totalesFecha) {
      const acumulado = await this.predsRepo
        .createQueryBuilder('p')
        .select('SUM(p.puntosObtenidos)', 'total')
        .where('p.user_id = :uid', { uid: row.userId })
        .getRawOne();

      await this.scoresRepo.upsert(
        {
          userId: row.userId,
          matchdayId,
          puntosFecha: Number(row.puntosFecha),
          puntosAcumulados: Number(acumulado?.total ?? 0),
        },
        ['userId', 'matchdayId'],
      );
    }

    const scores = await this.scoresRepo.find({ order: { puntosAcumulados: 'DESC' } });
    for (let i = 0; i < scores.length; i++) {
      await this.scoresRepo.update(scores[i].id, { posicion: i + 1 });
    }
  }

  async getRules(): Promise<ScoringRules> {
    const rules = await this.rulesRepo.findOne({ where: { activa: true } });
    if (!rules) throw new NotFoundException('No hay reglas de puntuacion activas');
    return rules;
  }

  async updateRules(ptsResultado: number, ptsExacto: number): Promise<ScoringRules> {
    const rules = await this.getRules();
    await this.rulesRepo.update(rules.id, { ptsResultado, ptsExacto });
    return this.rulesRepo.findOneOrFail({ where: { id: rules.id } });
  }
}
