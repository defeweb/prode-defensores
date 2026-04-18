import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity('matchdays')
export class Matchday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'season_id' })
  seasonId: number;

  @Column({ type: 'int' })
  numero: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  fechaLimite: Date | null;

  @OneToMany(() => Match, m => m.matchday)
  matches: Match[];
}
