import { IsString, IsDateString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateMatchDto {
  @IsNumber() matchdayId: number;
  @IsString() equipoLocal: string;
  @IsString() equipoVisitante: string;
  @IsDateString() inicio: string;
}

export class SetResultDto {
  @IsNumber() @Min(0) golesLocal: number;
  @IsNumber() @Min(0) golesVisitante: number;
}

export class CreateMatchdayDto {
  @IsNumber() seasonId: number;
  @IsNumber() numero: number;
  @IsOptional() @IsDateString() fechaLimite?: string;
}
