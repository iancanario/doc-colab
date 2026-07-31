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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmployeeDocument } from './entities/employee-document.entity';

@ApiTags('Documents')
@Controller('documents')
export class EmployeeDocumentsController {
  constructor(
    @Inject(IEmployeeDocumentService)
    private readonly documentsService: IEmployeeDocumentService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Adicionar novo Documento',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Document linked successfully' },
  })
  create(@Body() documentDto: CreateEmployeeDocumentDTO) {
    return this.documentsService.create(documentDto);
  }

  @Get('find-last-sents')
  @ApiOperation({
    summary: 'Retornar últimos envios',
  })
  @ApiResponse({
    status: 201,
    type: EmployeeDocument,
  })
  findLastSents() {
    return this.documentsService.findLastSents();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover novo Documento',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Document unlinked successfully' },
  })
  delete(@Param('id') id: number) {
    return this.documentsService.delete(id);
  }
}
