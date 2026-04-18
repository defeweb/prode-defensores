import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Matchday } from './matchday.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Matchday, m => m.matches)
  @JoinColumn({ name: 'matchday_id' })
  matchday: Matchday;

  @Column({ name: 'matchday_id' })
  matchdayId: number;

  @Column({ type: 'varchar', length: 100 })
  equipoLocal: string;

  @Column({ type: 'varchar', length: 100 })
  equipoVisitante: string;

  @Column({ type: 'int', nullable: true, default: null })
  golesLocal: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  golesVisitante: number | null;

  @Column({ type: 'datetime' })
  inicio: Date;

  @Column({ type: 'enum', enum: ['pendiente', 'en_curso', 'finalizado'], default: 'pendiente' })
  estado: string;
}
