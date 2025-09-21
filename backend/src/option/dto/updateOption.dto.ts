import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateoptionDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;
  @IsNotEmpty()
  @IsOptional()
  value?: string;
}
