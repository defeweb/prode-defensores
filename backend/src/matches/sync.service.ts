import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Matchday } from './matchday.entity';
import { ScoringService } from '../scoring/scoring.service';
import axios from 'axios';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(Match)    private matchesRepo: Repository<Match>,
    @InjectRepository(Matchday) private matchdaysRepo: Repository<Matchday>,
    private scoringService: ScoringService,
  ) {}

  async syncResultados(): Promise<{ actualizados: number; errores: string[]; detalle: string[] }> {
    this.logger.log('Iniciando sincronización...');
    const errores: string[] = [];
    const detalle: string[] = [];
    let actualizados = 0;

    const apiKey = process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      errores.push('Falta la variable API_FOOTBALL_KEY. Configurala en Hostinger.');
      return { actualizados, errores, detalle };
    }

    try {
      // API-Football - Liga Primera Nacional Argentina ID: 128
      const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
        params: {
          league: 128,
          season: 2026,
          status: 'FT', // solo finalizados
        },
        headers: {
          'x-apisports-key': apiKey,
        },
        timeout: 15000,
      });

      const fixtures = response.data?.response || [];
      this.logger.log('Partidos finalizados encontrados: ' + fixtures.length);

      for (const fixture of fixtures) {
        const nroFecha = fixture.league?.round?.replace(/\D/g, '');
        if (!nroFecha) continue;

        const matchday = await this.matchdaysRepo.findOne({
          where: { numero: +nroFecha, seasonId: 1 }
        });
        if (!matchday) continue;

        const golesLocal    = fixture.goals?.home;
        const golesVisitante = fixture.goals?.away;
        if (golesLocal === null || golesLocal === undefined) continue;
        if (golesVisitante === null || golesVisitante === undefined) continue;

        const localApi  = this.normalizar(fixture.teams?.home?.name || '');
        const visitaApi = this.normalizar(fixture.teams?.away?.name || '');

        const pendientes = await this.matchesRepo.find({
          where: { matchdayId: matchday.id, estado: 'pendiente' }
        });

        const encontrado = pendientes.find(m => {
          const localDB  = this.normalizar(m.equipoLocal);
          const visitaDB = this.normalizar(m.equipoVisitante);
          return this.similares(localDB, localApi) && this.similares(visitaDB, visitaApi);
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
    const wordsA = a.split(' ').filter(w => w.length > 3);
    const wordsB = b.split(' ').filter(w => w.length > 3);
    const comunes = wordsA.filter(w => wordsB.some(wb => wb.includes(w) || w.includes(wb)));
    return comunes.length >= 1;
  }
}
