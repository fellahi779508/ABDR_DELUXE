import { IsNotEmpty, IsNumber } from 'class-validator';

export class createSoldItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  carId: number;
}
