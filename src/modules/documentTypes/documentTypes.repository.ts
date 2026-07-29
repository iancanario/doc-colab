import { DataSource, Repository } from 'typeorm';
import { DocumentType } from './entities/documentType.entity';
import { IDocumentTypesRepository } from './interfaces/documentTypesRepository.interface';
import { CreateDocumentType } from './DTOs/createDocumentType.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentTypesRepository
  extends Repository<DocumentType>
  implements IDocumentTypesRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(DocumentType, dataSource.createEntityManager());
  }

  async createRepositoryType(
    documentType: CreateDocumentType,
  ): Promise<DocumentType> {
    const newDocumentType = this.create(documentType);
    return await this.save(newDocumentType);
  }

  async findRepositoryTypes(): Promise<DocumentType[]> {
    return await this.find();
  }

  async deleteRepositoryType(id: string): Promise<void> {
    await this.softDelete(id);
  }
}
