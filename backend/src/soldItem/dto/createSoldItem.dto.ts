import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createSoldItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  carSlug: string;
  @IsNotEmpty()
  @IsString()
  color: string;
}
