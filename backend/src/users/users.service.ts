import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
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

  async aprobar(id: number) {
    await this.repo.update(id, { activo: true });
    return { message: 'Usuario aprobado' };
  }

  async desactivar(id: number) {
    await this.repo.update(id, { activo: false });
    return { message: 'Usuario desactivado' };
  }
}
