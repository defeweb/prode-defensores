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

  async syncResultados(): Promise<{ actualizados: number; errores: string[] }> {
    this.logger.log('Iniciando sincronización de resultados...');
    const errores: string[] = [];
    let actualizados = 0;

    try {
      // API interna de Promiedos para Primera Nacional (ebj)
      const response = await axios.get('https://api.promiedos.com.ar/league/ebj/fixtures', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.promiedos.com.ar/',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      const data = response.data;
      if (!data || !data.dates) {
        errores.push('No se pudo obtener datos de Promiedos');
        return { actualizados, errores };
      }

      for (const fecha of data.dates) {
        const nroFecha = fecha.date_number;
        if (!nroFecha) continue;

        const matchday = await this.matchdaysRepo.findOne({ where: { numero: nroFecha, seasonId: 1 } });
        if (!matchday) continue;

        for (const partido of fecha.matches || []) {
          if (partido.status !== 'FT') continue; // solo finalizados

          const golesLocal    = parseInt(partido.score?.home ?? -1);
          const golesVisitante = parseInt(partido.score?.away ?? -1);
          if (isNaN(golesLocal) || isNaN(golesVisitante)) continue;

          const localNorm   = this.normalizar(partido.home?.name ?? '');
          const visitaNorm  = this.normalizar(partido.away?.name ?? '');

          const match = await this.matchesRepo
            .createQueryBuilder('m')
            .where('m.matchdayId = :mdId', { mdId: matchday.id })
            .andWhere('m.estado != :estado', { estado: 'finalizado' })
            .getMany();

          const encontrado = match.find(m =>
            this.normalizar(m.equipoLocal).includes(localNorm) ||
            localNorm.includes(this.normalizar(m.equipoLocal)) ||
            this.normalizar(m.equipoVisitante).includes(visitaNorm) ||
            visitaNorm.includes(this.normalizar(m.equipoVisitante))
          );

          if (encontrado) {
            await this.matchesRepo.update(encontrado.id, {
              golesLocal,
              golesVisitante,
              estado: 'finalizado',
            });
            // Disparar scoring
            setImmediate(() => {
              this.scoringService.calculateForMatch(encontrado.id).catch(err =>
                this.logger.error('Error scoring', err)
              );
            });
            actualizados++;
            this.logger.log('Actualizado: ' + encontrado.equipoLocal + ' ' + golesLocal + '-' + golesVisitante + ' ' + encontrado.equipoVisitante);
          }
        }
      }
    } catch (err: any) {
      this.logger.error('Error sync: ' + err.message);
      errores.push('Error conectando con Promiedos: ' + err.message);
    }

    return { actualizados, errores };
  }

  private normalizar(str: string): string {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
