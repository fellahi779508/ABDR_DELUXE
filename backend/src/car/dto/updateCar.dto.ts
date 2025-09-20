import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  finition?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Moteur?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Energie?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Boite?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Kilométrage?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Année?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
