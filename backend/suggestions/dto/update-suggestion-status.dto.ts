import { IsIn, IsString } from 'class-validator';

export class UpdateSuggestionStatusDto {
  @IsString()
  @IsIn(['open', 'done', 'rejected'])
  status!: string;
}
