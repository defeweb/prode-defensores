import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Matchday } from '../matches/matchday.entity';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Matchday)
  @JoinColumn({ name: 'matchday_id' })
  matchday: Matchday;

  @Column({ name: 'matchday_id' })
  matchdayId: number;

  @Column({ type: 'int', default: 0 })
  puntosFecha: number;

  @Column({ type: 'int', default: 0 })
  puntosAcumulados: number;

  @Column({ type: 'int', nullable: true, default: null })
  posicion: number | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
