import { Test, TestingModule } from '@nestjs/testing';
import { DocumentTypesService } from '../../document-types.service';
import { IDocumentTypesRepository } from '../../interfaces/document-types-repository.interface';
import { DocumentType } from '../../entities/document-type.entity';

describe('DocumentTypesService', () => {
  let service: DocumentTypesService;

  const repositoryMock = {
    createRepositoryType: jest.fn(),
    findRepositoryTypes: jest.fn(),
    deleteRepositoryType: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTypesService,
        {
          provide: IDocumentTypesRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get(DocumentTypesService);
  });

  describe('createDocumentType', () => {
    it('should create a document type successfully', async () => {
      const dto = {
        name: 'Contrato',
        code: 'Contract',
      };

      repositoryMock.createRepositoryType.mockResolvedValue(dto);

      const result = await service.createDocumentType(dto);

      expect(repositoryMock.createRepositoryType).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'created document type successfully',
      });
    });

    it('should throw an error when repository fails', async () => {
      repositoryMock.createRepositoryType.mockRejectedValue(
        new Error('database error'),
      );

      await expect(
        service.createDocumentType({
          name: 'Contrato',
          code: 'Contract',
        }),
      ).rejects.toThrow('Error in create document type');
    });
  });

  describe('findDocumentTypes', () => {
    it('should return document types', async () => {
      const documentTypes = [
        {
          id: '1',
          name: 'Contrato',
          code: 'Contract',
        },
      ] as DocumentType[];

      repositoryMock.findRepositoryTypes.mockResolvedValue(documentTypes);

      const result = await service.findDocumentTypes();

      expect(repositoryMock.findRepositoryTypes).toHaveBeenCalled();
      expect(result).toEqual(documentTypes);
    });

    it('should throw an error when repository fails', async () => {
      repositoryMock.findRepositoryTypes.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.findDocumentTypes()).rejects.toThrow(
        'Error in find document types',
      );
    });
  });

  describe('deleteDocumentType', () => {
    it('should delete a document type successfully', async () => {
      repositoryMock.deleteRepositoryType.mockResolvedValue(undefined);

      const result = await service.deleteDocumentType('1');

      expect(repositoryMock.deleteRepositoryType).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'deleted document type successfully',
      });
    });

    it('should throw an error when repository fails', async () => {
      repositoryMock.deleteRepositoryType.mockRejectedValue(
        new Error('database error'),
      );

      await expect(service.deleteDocumentType('1')).rejects.toThrow(
        'Error in delete document type',
      );
    });
  });
});
