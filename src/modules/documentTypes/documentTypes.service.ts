import { Inject, Injectable } from '@nestjs/common';
import { IDocumentTypesService } from './interfaces/documentTypesService.interface';
import { IDocumentTypesRepository } from './interfaces/documentTypesRepository.interface';
import { CreateDocumentType } from './DTOs/createDocumentType.dto';
import { DocumentType } from './entities/documentType.entity';

@Injectable()
export class DocumentTypesService implements IDocumentTypesService {
  constructor(
    @Inject(IDocumentTypesRepository)
    private readonly dtRepository: IDocumentTypesRepository,
  ) {}

  async createDocumentType(
    documentType: CreateDocumentType,
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
