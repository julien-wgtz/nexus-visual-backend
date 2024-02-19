import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
