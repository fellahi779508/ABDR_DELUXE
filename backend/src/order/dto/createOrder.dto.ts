import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNumber()
  @IsNotEmpty()
  carId: number[] | number;
}
