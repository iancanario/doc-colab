import { Controller, Get, Inject, Query } from '@nestjs/common';
import { IEmployeeDocumentRequirementService } from './interfaces/employee-document-requirement-service.interface';
import { FindPendingDocumentsDTO } from './dtos/find-pending-documents.dto';

@Controller('requirements')
export class EmployeeDocumentRequirementsController {
  constructor(
    @Inject(IEmployeeDocumentRequirementService)
    private readonly requirementService: IEmployeeDocumentRequirementService,
  ) {}

  @Get()
  findPendings(@Query() filters: FindPendingDocumentsDTO) {
    return this.requirementService.findDocumentsPending(filters);
  }

  @Get('percentual-pendings')
  percentualPendings() {
    return this.requirementService.percentualSentDocuments();
  }

  @Get('most-pendings')
  mostDocsPendings() {
    return this.requirementService.mostDocumentsPendings();
  }
}
