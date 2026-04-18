import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('scoring_rules')
export class ScoringRules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 1 })
  ptsResultado: number;

  @Column({ type: 'int', default: 3 })
  ptsExacto: number;

  @Column({ type: 'boolean', default: true })
  activa: boolean;
}
