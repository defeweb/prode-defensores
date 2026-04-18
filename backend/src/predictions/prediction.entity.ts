import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Match } from '../matches/match.entity';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ name: 'match_id' })
  matchId: number;

  @Column({ type: 'enum', enum: ['L', 'E', 'V'] })
  resultado: string;

  @Column({ type: 'int', nullable: true, default: null })
  golesLocal: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  golesVisitante: number | null;

  @Column({ type: 'int', default: 0 })
  puntosObtenidos: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
