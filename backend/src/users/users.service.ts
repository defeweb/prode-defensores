import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailService } from '../auth/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private mail: MailService,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      select: ['id', 'nombre', 'email', 'nroSocio', 'rol', 'activo', 'createdAt'],
    });
  }

  findPending() {
    return this.repo.find({
      where: { activo: false, rol: 'socio' },
      order: { createdAt: 'DESC' },
      select: ['id', 'nombre', 'email', 'nroSocio', 'createdAt'],
    });
  }

  findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'nombre', 'email', 'nroSocio', 'rol', 'activo', 'createdAt'],
    });
  }

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, data: Partial<User>) {
    return this.repo.update(id, data);
  }

  async updateProfile(id: number, dto: { nombre?: string; nroSocio?: string; password?: string }) {
    const data: Partial<User> = {};
    if (dto.nombre)   data.nombre   = dto.nombre;
    if (dto.nroSocio) data.nroSocio = dto.nroSocio;
    if (dto.password) data.passwordHash = await bcrypt.hash(dto.password, 12);
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async aprobar(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    await this.repo.update(id, { activo: true });
    // Enviar email de bienvenida
    if (user) {
      this.mail.sendAprobacion(user.email, user.nombre).catch(() => {});
    }
    return { message: 'Usuario aprobado' };
  }

  async desactivar(id: number) {
    await this.repo.update(id, { activo: false });
    return { message: 'Usuario desactivado' };
  }
}
