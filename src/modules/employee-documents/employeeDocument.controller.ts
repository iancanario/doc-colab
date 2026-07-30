import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IEmployeeDocumentService } from './interfaces/employee-document-service.interface';
import { CreateEmployeeDocumentDTO } from './dtos/create-employee-document.dto';
import { FindPendingDocumentsDTO } from '../employee-document-requirements/dtos/find-pending-documents.dto';

@Controller('documents')
export class EmployeeDocumentsController {
  constructor(
    @Inject(IEmployeeDocumentService)
    private readonly documentsService: IEmployeeDocumentService,
  ) {}

  @Post()
  create(@Body() documentDto: CreateEmployeeDocumentDTO) {
    return this.documentsService.create(documentDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
