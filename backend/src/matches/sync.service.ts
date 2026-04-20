import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Matchday } from './matchday.entity';
import { ScoringService } from '../scoring/scoring.service';
import axios from 'axios';

const SOFASCORE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Referer': 'https://www.sofascore.com/',
};

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Match)    private matchesRepo: Repository<Match>,
    @InjectRepository(Matchday) private matchdaysRepo: Repository<Matchday>,
    private scoringService: ScoringService,
  ) {}

  async syncResultados(): Promise<{ actualizados: number; errores: string[]; detalle: string[] }> {
    this.logger.log('Iniciando sincronización con Sofascore...');
    const errores: string[] = [];
    const detalle: string[] = [];
    let actualizados = 0;

    try {
      // Obtener todas las fechas del torneo Primera Nacional 2026 (ID 703, season 2026)
      const seasonsRes = await axios.get(
        'https://api.sofascore.com/api/v1/unique-tournament/703/seasons',
        { headers: SOFASCORE_HEADERS, timeout: 10000 }
      );

      const seasons = seasonsRes.data?.seasons || [];
      const season2026 = seasons.find((s: any) =>
        s.year === '2026' || s.name?.includes('2026')
      );

      if (!season2026) {
        errores.push('No se encontró la temporada 2026 en Sofascore');
        return { actualizados, errores, detalle };
      }

      const seasonId = season2026.id;
      this.logger.log('Season ID 2026: ' + seasonId);

      // Obtener rondas disponibles
      const roundsRes = await axios.get(
        'https://api.sofascore.com/api/v1/unique-tournament/703/season/' + seasonId + '/rounds',
        { headers: SOFASCORE_HEADERS, timeout: 10000 }
      );

      const rounds = roundsRes.data?.rounds || [];
      this.logger.log('Rondas encontradas: ' + rounds.length);

      for (const round of rounds) {
        const nroFecha = round.round;
        if (!nroFecha) continue;

        const matchday = await this.matchdaysRepo.findOne({
          where: { numero: nroFecha, seasonId: 1 }
        });
        if (!matchday) continue;

        // Obtener partidos de esta ronda
        const eventsRes = await axios.get(
          'https://api.sofascore.com/api/v1/unique-tournament/703/season/' + seasonId + '/events/round/' + nroFecha,
          { headers: SOFASCORE_HEADERS, timeout: 10000 }
        );

        const events = eventsRes.data?.events || [];

        for (const event of events) {
          if (event.status?.type !== 'finished') continue;

          const golesLocal    = event.homeScore?.current;
          const golesVisitante = event.awayScore?.current;
          if (golesLocal === undefined || golesVisitante === undefined) continue;

          const localSofa  = this.normalizar(event.homeTeam?.name || '');
          const visitaSofa = this.normalizar(event.awayTeam?.name || '');

          // Buscar partido pendiente en nuestra DB
          const pendientes = await this.matchesRepo.find({
            where: { matchdayId: matchday.id, estado: 'pendiente' }
          });

          const encontrado = pendientes.find(m => {
            const localDB  = this.normalizar(m.equipoLocal);
            const visitaDB = this.normalizar(m.equipoVisitante);
            return this.similares(localDB, localSofa) && this.similares(visitaDB, visitaSofa);
          });

          if (encontrado) {
            await this.matchesRepo.update(encontrado.id, {
              golesLocal,
              golesVisitante,
              estado: 'finalizado',
            });

            setImmediate(() => {
              this.scoringService.calculateForMatch(encontrado.id).catch(err =>
                this.logger.error('Error scoring', err)
              );
            });

            const msg = 'F' + nroFecha + ': ' + encontrado.equipoLocal + ' ' + golesLocal + '-' + golesVisitante + ' ' + encontrado.equipoVisitante;
            detalle.push(msg);
            this.logger.log('✓ ' + msg);
            actualizados++;
          }
        }

        // Pequeña pausa para no saturar la API
        await new Promise(r => setTimeout(r, 300));
      }

    } catch (err: any) {
      this.logger.error('Error sync: ' + err.message);
      errores.push('Error: ' + err.message);
    }

    return { actualizados, errores, detalle };
  }

  private normalizar(str: string): string {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[.\-()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private similares(a: string, b: string): boolean {
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;

    // Palabras clave en común
    const wordsA = a.split(' ').filter(w => w.length > 3);
    const wordsB = b.split(' ').filter(w => w.length > 3);
    const comunes = wordsA.filter(w => wordsB.some(wb => wb.includes(w) || w.includes(wb)));
    return comunes.length >= 1;
  }
}
