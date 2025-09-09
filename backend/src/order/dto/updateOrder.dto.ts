import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
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
