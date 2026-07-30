import { Inject } from '@nestjs/common';
import { CreateEmployeeDocumentDTO } from '../employee-documents/dtos/create-employee-document.dto';
import { IEmployeeDocumentRequirementService } from './interfaces/employee-document-requirement-service.interface';
import { IEmployeeDocumentRequirementRepository } from './interfaces/employee-document-requirement-repository.interface';
import { EmployeeDocument } from '../employee-documents/entities/employee-document.entity';
import { FindPendingDocumentsDTO } from './dtos/find-pending-documents.dto';

export class EmployeeDocumentRequirementsService implements IEmployeeDocumentRequirementService {
  constructor(
    @Inject(IEmployeeDocumentRequirementRepository)
    private readonly requirementRepository: IEmployeeDocumentRequirementRepository,
  ) {}
  async findDocumentsPending(
    filters: FindPendingDocumentsDTO,
  ): Promise<{ data: EmployeeDocument[]; meta: any }> {
    return this.requirementRepository.findPendingDocuments(filters);
  }
}
