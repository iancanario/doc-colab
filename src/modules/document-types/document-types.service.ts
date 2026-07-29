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
    try {
      await this.dtRepository.createRepositoryType(documentType);
      return { message: 'created document type successfully' };
    } catch (error) {
      throw Error('Error in create document type');
    }
  }

  async findDocumentTypes(): Promise<DocumentType[]> {
    try {
      return await this.dtRepository.findRepositoryTypes();
    } catch (error) {
      throw Error('Error in find document types');
    }
  }

  async deleteDocumentType(id: string): Promise<{ message: string }> {
    try {
      await this.dtRepository.deleteRepositoryType(id);
      return { message: 'deleted document type successfully' };
    } catch (error) {
      throw Error('Error in delete document type');
    }
  }
}
