import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePredictionDto {
  @IsNumber() matchId: number;
  @IsEnum(['L', 'E', 'V']) resultado: string;
  @IsOptional() @IsNumber() @Min(0) golesLocal?: number;
  @IsOptional() @IsNumber() @Min(0) golesVisitante?: number;
}
