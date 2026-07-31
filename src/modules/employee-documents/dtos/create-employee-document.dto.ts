import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUrl, IsUUID } from 'class-validator';

export class CreateEmployeeDocumentDTO {
  @ApiProperty({
    example: '468b2024-2b65-42c7-bc60-1b527529321d',
  })
  @IsUUID()
  employeeId!: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  requirementId!: number;

  @IsUrl()
  @ApiProperty({
    example: 'http://photo.com.br',
  })
  documentUrl!: string;
}
