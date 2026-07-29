import { CreateDocumentType } from "../DTOs/createDocumentType.dto";
import { DocumentType } from "../entities/documentType.entity";

export abstract class IDocumentTypesService {
  abstract createDocumentType(documentType: CreateDocumentType): Promise<{ message: string }>
  abstract findDocumentTypes(): Promise<DocumentType[]>
  abstract deleteDocumentType(id: string): Promise<{ message:string }>
}