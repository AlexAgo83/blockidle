import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSuggestionDto {
  @IsString()
  @MaxLength(64)
  player!: string;

  @IsString()
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsString()
  @IsIn(['feature', 'bug'])
  category?: string;
}
