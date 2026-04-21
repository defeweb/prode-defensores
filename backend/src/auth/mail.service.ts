import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = frontendUrl + '/reset-password?token=' + token;

    try {
      await sgMail.send({
        to,
        from: {
          email: 'info@defeweb.com.ar',
          name: 'Prode Defensores de Belgrano',
        },
        subject: 'Recuperá tu contraseña — Prode Defensores',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #1a1a1a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #C8102E; margin: 0; font-size: 24px;">Prode Defensores</h1>
              <p style="color: #aaa; margin: 4px 0 0; font-size: 14px;">Club Defensores de Belgrano</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1a1a1a; font-size: 18px;">Recupero de contraseña</h2>
              <p style="color: #444; font-size: 14px; line-height: 1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
                Hacé clic en el botón para crear una nueva contraseña.
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${link}" style="background: #C8102E; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                  Restablecer contraseña
                </a>
              </div>
              <p style="color: #888; font-size: 12px; line-height: 1.5;">
                Este link expira en <strong>1 hora</strong>.<br>
                Si no solicitaste este cambio, ignorá este email.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #aaa; font-size: 11px; text-align: center;">
                Prode Defensores de Belgrano · Primera Nacional 2026
              </p>
            </div>
          </div>
        `,
      });
      this.logger.log('Email de recupero enviado a ' + to);
    } catch (err: any) {
      this.logger.error('Error enviando email: ' + err.message);
      throw err;
    }
  }

  async sendAprobacion(to: string, nombre: string): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: {
          email: 'info@defeweb.com.ar',
          name: 'Prode Defensores de Belgrano',
        },
        subject: '¡Tu cuenta fue aprobada! — Prode Defensores',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #1a1a1a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #C8102E; margin: 0; font-size: 24px;">Prode Defensores</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1a7a3c; font-size: 18px;">¡Bienvenido al Prode, ${nombre}!</h2>
              <p style="color: #444; font-size: 14px; line-height: 1.6;">
                Tu cuenta fue aprobada por el administrador. 
                Ya podés ingresar y empezar a pronosticar los partidos de Defensores de Belgrano en la Primera Nacional 2026.
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="background: #C8102E; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                  ¡Jugar ahora!
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #aaa; font-size: 11px; text-align: center;">
                Prode Defensores de Belgrano · Primera Nacional 2026
              </p>
            </div>
          </div>
        `,
      });
      this.logger.log('Email de aprobación enviado a ' + to);
    } catch (err: any) {
      this.logger.error('Error enviando email aprobacion: ' + err.message);
    }
  }
}
