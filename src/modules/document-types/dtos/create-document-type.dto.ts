import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDTO {
  @ApiProperty({
    example: 'CPF',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'cpf',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
