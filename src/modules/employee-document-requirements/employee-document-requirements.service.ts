import { Inject, Injectable } from '@nestjs/common';
import { IEmployeeDocumentRequirementService } from './interfaces/employee-document-requirement-service.interface';
import { IEmployeeDocumentRequirementRepository } from './interfaces/employee-document-requirement-repository.interface';
import { EmployeeDocument } from '../employee-documents/entities/employee-document.entity';
import { FindPendingDocumentsDTO } from './dtos/find-pending-documents.dto';
import { EmployeeDocumentRequirement } from './entities/employee-document-requirement.entity';

@Injectable()
export class EmployeeDocumentRequirementsService implements IEmployeeDocumentRequirementService {
  constructor(
    @Inject(IEmployeeDocumentRequirementRepository)
    private readonly requirementRepository: IEmployeeDocumentRequirementRepository,
  ) {}

  async findDocumentsPending(
    filters: FindPendingDocumentsDTO,
  ): Promise<{ data: EmployeeDocument[]; meta: any }> {
    return await this.requirementRepository.findPendingDocuments(filters);
  }

  async percentualSentDocuments(): Promise<number> {
    return await this.requirementRepository.percentualSentDocuments();
  }

  async mostDocumentsPendings(): Promise<EmployeeDocumentRequirement[]> {
    return await this.requirementRepository.mostDocumentsPendings();
  }
}
