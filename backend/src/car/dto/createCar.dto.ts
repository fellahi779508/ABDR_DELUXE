import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  finition?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  Moteur: string;

  @IsString()
  @IsNotEmpty()
  Energie: string;

  @IsString()
  @IsNotEmpty()
  Boite: string;

  @IsString()
  @IsNotEmpty()
  Kilométrage: string;

  @IsString()
  @IsNotEmpty()
  Année: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsBoolean()
  @IsNotEmpty()
  isVisible: boolean;

  @IsNumber()
  @IsNotEmpty()
  serieId: number;
}
