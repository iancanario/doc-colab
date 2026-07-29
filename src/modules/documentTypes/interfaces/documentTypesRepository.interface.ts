import { CreateDocumentType } from "../DTOs/createDocumentType.dto";
import { DocumentType } from "../entities/documentType.entity";

export abstract class IDocumentTypesRepository {
  abstract createRepositoryType(documentType: CreateDocumentType): Promise<DocumentType>
  abstract findRepositoryTypes(): Promise<DocumentType[]>
  abstract deleteRepositoryType(id: string): Promise<void>
}