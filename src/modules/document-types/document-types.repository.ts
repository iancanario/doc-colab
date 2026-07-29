import { DataSource, Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';
import { IDocumentTypesRepository } from './interfaces/document-types-repository.interface';
import { CreateDocumentTypeDTO } from './dtos/create-document-type.dto';
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
    documentType: CreateDocumentTypeDTO,
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
