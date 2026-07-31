import { Controller, Get, Inject, Query } from '@nestjs/common';
import { IEmployeeDocumentRequirementService } from './interfaces/employee-document-requirement-service.interface';
import { FindPendingDocumentsDTO } from './dtos/find-pending-documents.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmployeeDocumentRequirement } from './entities/employee-document-requirement.entity';

@ApiTags('Requirements')
@Controller('requirements')
export class EmployeeDocumentRequirementsController {
  constructor(
    @Inject(IEmployeeDocumentRequirementService)
    private readonly requirementService: IEmployeeDocumentRequirementService,
  ) {}

  @Get('pendings')
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'documentTypeId',
    required: false,
    example: '468b2024-2b65-42c7-bc60-1b527529321d',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 1,
  })
  @ApiOperation({
    summary: 'listar documento pendentes',
  })
  @ApiResponse({
    status: 201,
    type: EmployeeDocumentRequirement,
  })
  findPendings(@Query() filters: FindPendingDocumentsDTO) {
    return this.requirementService.findDocumentsPending(filters);
  }

  @Get('percentual-pendings')
  @ApiOperation({
    summary: 'percential de documentos pendentes',
  })
  @ApiResponse({
    status: 201,
    example: 10,
  })
  percentualPendings() {
    return this.requirementService.percentualSentDocuments();
  }

  @Get('most-pendings')
  @ApiOperation({
    summary: 'Listar os mais pendentes',
  })
  @ApiResponse({
    status: 201,
    type: [EmployeeDocumentRequirement],
  })
  mostDocsPendings() {
    return this.requirementService.mostDocumentsPendings();
  }
}
