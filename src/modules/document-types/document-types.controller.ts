import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateDocumentTypeDTO } from './dtos/create-document-type.dto';
import { IDocumentTypesService } from './interfaces/document-types-service.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentType } from './entities/document-type.entity';

@ApiTags('Document Types')
@Controller('document-types')
export class DocumentTypesController {
  constructor(
    @Inject(IDocumentTypesService)
    private readonly dtService: IDocumentTypesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Adicionar novo tipo de documento',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'created document type successfully' },
  })
  create(@Body() documentType: CreateDocumentTypeDTO) {
    return this.dtService.createDocumentType(documentType);
  }

  @Get()
  @ApiOperation({
    summary: 'listar tipos de documento',
  })
  @ApiResponse({
    status: 201,
    type: DocumentType,
  })
  find() {
    return this.dtService.findDocumentTypes();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'remove tipo de documento',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Delete document type successfully' },
  })
  delete(@Param('id') id: string) {
    return this.dtService.deleteDocumentType(id);
  }
}
