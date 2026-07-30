import { EmployeeDocument } from 'src/modules/employee-documents/entities/employee-document.entity';
import { FindPendingDocumentsDTO } from '../dtos/find-pending-documents.dto';
import { EmployeeDocumentRequirement } from '../entities/employee-document-requirement.entity';

export abstract class IEmployeeDocumentRequirementRepository {
  abstract findPendingDocuments(
    filters: FindPendingDocumentsDTO,
  ): Promise<{ data: EmployeeDocument[]; meta: any }>;
  abstract percentualSentDocuments(): Promise<number>;
  abstract mostDocumentsPendings(): Promise<EmployeeDocumentRequirement[]>;
}
