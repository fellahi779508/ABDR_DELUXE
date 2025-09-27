import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Matches(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNumber()
  @IsNotEmpty()
  cartId: number;
}
