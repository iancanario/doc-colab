import { CreateDocumentTypeDTO } from '../dtos/create-document-type.dto';
import { DocumentType } from '../entities/document-type.entity';

export abstract class IDocumentTypesRepository {
  abstract createRepositoryType(
    documentType: CreateDocumentTypeDTO,
  ): Promise<DocumentType>;
  abstract findRepositoryTypes(): Promise<DocumentType[]>;
  abstract deleteRepositoryType(id: string): Promise<void>;
}
