import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { CreateDocumentType } from "./DTOs/createDocumentType.dto";
import { IDocumentTypesService } from "./interfaces/documentTypesService.interface";

@Controller('document-types')
export class DocumentTypesController {
  constructor(
    @Inject(IDocumentTypesService)
    private readonly dtService: IDocumentTypesService
  ) {}

  @Post()
  create(@Body() documentType: CreateDocumentType) {
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