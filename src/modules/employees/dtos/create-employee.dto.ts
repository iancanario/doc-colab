import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDTO {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do funcionário',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'js@teste.com',
  })
  @IsEmail()
  email!: string;

  @IsArray()
  @ApiProperty({
    example: [2, 3],
    description: 'Id dos tipo de documento obrigatorios para o funcionario',
  })
  documentTypeIds!: number[];
}
