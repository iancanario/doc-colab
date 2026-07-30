import { EmployeeDocument } from '../../employee-documents/entities/employee-document.entity';
import { FindPendingDocumentsDTO } from 'src/modules/employee-document-requirements/dtos/find-pending-documents.dto';

export abstract class IEmployeeDocumentRequirementService {
  abstract findDocumentsPending(
    filters: FindPendingDocumentsDTO,
  ): Promise<{ data: EmployeeDocument[]; meta: any }>;
  abstract percentualSentDocuments(): Promise<number>;
}
