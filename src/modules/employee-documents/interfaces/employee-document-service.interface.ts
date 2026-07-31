import { FindPendingDocumentsDTO } from 'src/modules/employee-document-requirements/dtos/find-pending-documents.dto';
import { CreateEmployeeDocumentDTO } from '../dtos/create-employee-document.dto';
import { EmployeeDocument } from '../entities/employee-document.entity';

export abstract class IEmployeeDocumentService {
  abstract create(
    documentDto: CreateEmployeeDocumentDTO,
  ): Promise<{ message: string }>;
  abstract findLastSents(): Promise<EmployeeDocument[]>;
  abstract delete(id: number): Promise<{ message: string }>;
}
