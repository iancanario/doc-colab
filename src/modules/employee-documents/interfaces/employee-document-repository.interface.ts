import { CreateEmployeeDocumentDTO } from '../dtos/create-employee-document.dto';
import { EmployeeDocument } from '../entities/employee-document.entity';

export abstract class IEmployeeDocumentsRepository {
  abstract createEmployeeDocument(
    documentDto: CreateEmployeeDocumentDTO,
  ): Promise<EmployeeDocument>;
  abstract findLastSents(): Promise<EmployeeDocument[]>;
  abstract deleteEmployeeDocument(id: number): Promise<void>;
}
