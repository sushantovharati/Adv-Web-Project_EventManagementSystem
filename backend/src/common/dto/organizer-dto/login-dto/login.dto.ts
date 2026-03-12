import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  organizerEmail: string;

  @IsString()
  @IsNotEmpty()
  organizerPassword: string;
}
