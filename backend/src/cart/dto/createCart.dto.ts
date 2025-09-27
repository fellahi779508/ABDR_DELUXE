import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsArray()
  soldItemId: number[];
}
