import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nroSocio: string;

  @Column({ type: 'enum', enum: ['socio', 'admin'], default: 'socio' })
  rol: string;

  @Column({ type: 'boolean', default: false })
  activo: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  resetToken: string | null;

  @Column({ type: 'datetime', nullable: true, default: null })
  resetTokenExpiry: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
