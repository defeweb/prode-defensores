import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() nombre: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @MinLength(1) nroSocio: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

export class ForgotPasswordDto {
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @IsString() token: string;
  @IsString() @MinLength(6) newPassword: string;
}
