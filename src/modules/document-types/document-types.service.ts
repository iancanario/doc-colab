import { Inject, Injectable } from '@nestjs/common';
import { IDocumentTypesService } from './interfaces/document-types-service.interface';
import { IDocumentTypesRepository } from './interfaces/document-types-repository.interface';
import { CreateDocumentTypeDTO } from './dtos/create-document-type.dto';
import { DocumentType } from './entities/document-type.entity';

@Injectable()
export class DocumentTypesService implements IDocumentTypesService {
  constructor(
    @Inject(IDocumentTypesRepository)
    private readonly dtRepository: IDocumentTypesRepository,
  ) {}

  async createDocumentType(
    documentType: CreateDocumentTypeDTO,
  ): Promise<{ message: string }> {
    await this.dtRepository.createRepositoryType(documentType);
    return { message: 'created document type successfully' };
  }

  async findDocumentTypes(): Promise<DocumentType[]> {
    return await this.dtRepository.findRepositoryTypes();
  }

  async deleteDocumentType(id: string): Promise<{ message: string }> {
    await this.dtRepository.deleteRepositoryType(id);
    return { message: 'deleted document type successfully' };
  }
}
