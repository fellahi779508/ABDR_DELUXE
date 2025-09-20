import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  value: string;
  @IsNotEmpty()
  @IsString()
  CarId: string;
}
