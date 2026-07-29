import { CreateDocumentTypeDTO } from '../dtos/create-document-type.dto';
import { DocumentType } from '../entities/document-type.entity';

export abstract class IDocumentTypesService {
  abstract createDocumentType(
    documentType: CreateDocumentTypeDTO,
  ): Promise<{ message: string }>;
  abstract findDocumentTypes(): Promise<DocumentType[]>;
  abstract deleteDocumentType(id: string): Promise<{ message: string }>;
}
