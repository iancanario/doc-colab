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

@Controller('document-types')
export class DocumentTypesController {
  constructor(
    @Inject(IDocumentTypesService)
    private readonly dtService: IDocumentTypesService,
  ) {}

  @Post()
  create(@Body() documentType: CreateDocumentTypeDTO) {
    return this.dtService.createDocumentType(documentType);
  }

  @Get()
  find() {
    return this.dtService.findDocumentTypes();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dtService.deleteDocumentType(id);
  }
}
