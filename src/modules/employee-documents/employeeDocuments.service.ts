import { Inject, Injectable } from '@nestjs/common';
import { IEmployeeDocumentsRepository } from './interfaces/employee-document-repository.interface';
import { IEmployeeDocumentService } from './interfaces/employee-document-service.interface';
import { CreateEmployeeDocumentDTO } from './dtos/create-employee-document.dto';
import { IEmployeeDocumentRequirementRepository } from '../employee-document-requirements/interfaces/employee-document-requirement-repository.interface';
import { FindPendingDocumentsDTO } from '../employee-document-requirements/dtos/find-pending-documents.dto';
import { EmployeeDocument } from './entities/employee-document.entity';

@Injectable()
export class EmployeeDocumentsService implements IEmployeeDocumentService {
  constructor(
    @Inject(IEmployeeDocumentsRepository)
    private readonly documentsRepository: IEmployeeDocumentsRepository,
  ) {}

  async create(
    documentDto: CreateEmployeeDocumentDTO,
  ): Promise<{ message: string }> {
    await this.documentsRepository.createEmployeeDocument(documentDto);
    return { message: 'Document linked successfully' };
  }

  async findLastSents(): Promise<EmployeeDocument[]> {
    return await this.documentsRepository.findLastSents();
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.documentsRepository.deleteEmployeeDocument(id);
    return { message: 'Document unlinked successfully' };
  }
}
