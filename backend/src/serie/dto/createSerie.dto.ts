import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSerieDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  brandId: number;
}
