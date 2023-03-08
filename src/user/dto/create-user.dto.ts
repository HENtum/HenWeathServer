import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(11)
  name: string;
  @IsString()
  @MaxLength(30)
  @MinLength(5)
  password: string;
}
