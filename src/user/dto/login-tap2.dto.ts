import { IsString } from 'class-validator';

export class LoginTap2 {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
