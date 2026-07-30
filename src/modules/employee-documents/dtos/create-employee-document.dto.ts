import { IsNumber, IsUrl, IsUUID } from 'class-validator';

export class CreateEmployeeDocumentDTO {
  @IsUUID()
  employeeId!: string;

  @IsNumber()
  requirementId!: number;

  @IsUrl()
  documentUrl!: string;
}
