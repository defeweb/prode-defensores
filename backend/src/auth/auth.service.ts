import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.users.create({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      nroSocio: dto.nroSocio,
      activo: false, // pendiente de aprobación
    });

    return {
      message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador. Te avisaremos cuando esté habilitada.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    if (!user.activo && user.rol !== 'admin') {
      throw new ForbiddenException('Tu cuenta está pendiente de aprobación. Contactá al administrador.');
    }

    return this.generateToken(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(rawToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.users.update(user.id, {
      resetToken: hash,
      resetTokenExpiry: expiry,
    });

    console.log('Token de reset para ' + user.email + ': ' + rawToken);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const users = await this.usersRepo.find({
      where: { resetTokenExpiry: MoreThan(new Date()) },
    });

    let target: User | null = null;
    for (const u of users) {
      if (u.resetToken && await bcrypt.compare(dto.token, u.resetToken)) {
        target = u;
        break;
      }
    }

    if (!target) throw new BadRequestException('Token inválido o expirado');

    await this.users.update(target.id, {
      passwordHash: await bcrypt.hash(dto.newPassword, 12),
      resetToken: null,
      resetTokenExpiry: null,
    });
  }

  private generateToken(user: User) {
    return {
      access_token: this.jwt.sign({ sub: user.id, email: user.email }),
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    };
  }
}
