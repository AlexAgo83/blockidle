import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  @MaxLength(64)
  player!: string;

  @IsNumber()
  score!: number;

  @IsOptional()
  @IsNumber()
  stage?: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  build?: string;

  @IsOptional()
  @IsString()
  endedAt?: string;
}
