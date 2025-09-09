import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(3, { message: 'username must be at least 3 characters' })
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @Length(6, 20, { message: 'password must be between 6 and 20 characters' })
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  password: string;
}
