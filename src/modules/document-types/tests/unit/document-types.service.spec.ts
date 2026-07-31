import { DocumentTypesService } from '../../document-types.service';
import { IDocumentTypesRepository } from '../../interfaces/document-types-repository.interface';
import { DocumentType } from '../../entities/document-type.entity';
import { CreateDocumentTypeDTO } from '../../dtos/create-document-type.dto';

describe('DocumentTypesService', () => {
  let service: DocumentTypesService;
  let dtRepository: jest.Mocked<IDocumentTypesRepository>;

  beforeEach(() => {
    dtRepository = {
      createRepositoryType: jest.fn(),
      findRepositoryTypes: jest.fn(),
      deleteRepositoryType: jest.fn(),
    } as jest.Mocked<IDocumentTypesRepository>;

    service = new DocumentTypesService(dtRepository);
  });

  describe('createDocumentType', () => {
    it('should create a document type successfully', async () => {
      const dto: CreateDocumentTypeDTO = {
        name: 'RG',
        code: 'RG-001',
      } as CreateDocumentTypeDTO;

      dtRepository.createRepositoryType.mockResolvedValue({} as DocumentType);

      const result = await service.createDocumentType(dto);

      expect(dtRepository.createRepositoryType).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'created document type successfully' });
    });

    it('should propagate repository error when creating document type', async () => {
      const dto: CreateDocumentTypeDTO = {
        name: 'RG',
        code: 'RG-001',
      } as CreateDocumentTypeDTO;

      const error = new Error('Database error');

      dtRepository.createRepositoryType.mockRejectedValue(error);

      await expect(service.createDocumentType(dto)).rejects.toBe(error);
      expect(dtRepository.createRepositoryType).toHaveBeenCalledWith(dto);
    });
  });

  describe('findDocumentTypes', () => {
    it('should return a list of document types successfully', async () => {
      const documentTypes = [{ id: 1 }, { id: 2 }] as DocumentType[];
      dtRepository.findRepositoryTypes.mockResolvedValue(documentTypes);

      const result = await service.findDocumentTypes();

      expect(dtRepository.findRepositoryTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(documentTypes);
    });

    it('should return an empty array when there are no document types', async () => {
      dtRepository.findRepositoryTypes.mockResolvedValue([]);

      const result = await service.findDocumentTypes();

      expect(dtRepository.findRepositoryTypes).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should propagate repository error when finding document types', async () => {
      const error = new Error('Database error');

      dtRepository.findRepositoryTypes.mockRejectedValue(error);

      await expect(service.findDocumentTypes()).rejects.toBe(error);
      expect(dtRepository.findRepositoryTypes).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteDocumentType', () => {
    it('should delete a document type successfully', async () => {
      dtRepository.deleteRepositoryType.mockResolvedValue(undefined);

      const result = await service.deleteDocumentType('1');

      expect(dtRepository.deleteRepositoryType).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'deleted document type successfully' });
    });

    it('should propagate repository error when deleting', async () => {
      const error = new Error('Database error');
      dtRepository.deleteRepositoryType.mockRejectedValue(error);

      await expect(service.deleteDocumentType('1')).rejects.toBe(error);
      expect(dtRepository.deleteRepositoryType).toHaveBeenCalledWith('1');
    });
  });
});
