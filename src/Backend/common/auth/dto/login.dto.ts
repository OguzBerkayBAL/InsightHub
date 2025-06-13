import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
