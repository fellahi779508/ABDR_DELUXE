import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromoPicDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  carSlug?: string;
}
