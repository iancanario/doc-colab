import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
