import { DataSource, UpdateResult } from 'typeorm';
import { DocumentTypesRepository } from '../../document-types.repository';
import { DocumentType } from '../../entities/document-type.entity';
import { CreateDocumentTypeDTO } from '../../dtos/create-document-type.dto';

describe('DocumentTypesRepository', () => {
  let repository: DocumentTypesRepository;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    dataSource = {
      createEntityManager: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    repository = new DocumentTypesRepository(dataSource);
  });

  describe('createRepositoryType', () => {
    it('should create and save a document type successfully', async () => {
      const dto: CreateDocumentTypeDTO = {
        name: 'RG',
        code: 'RG-001',
      } as CreateDocumentTypeDTO;

      const created = { name: 'RG', code: 'RG-001' } as DocumentType;
      const saved = { id: 1, name: 'RG', code: 'RG-001' } as DocumentType;

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(created);
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(saved as any);

      const result = await repository.createRepositoryType(dto);

      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });

    it('should throw an error when save fails', async () => {
      const dto: CreateDocumentTypeDTO = {
        name: 'RG',
        code: 'RG-001',
      } as CreateDocumentTypeDTO;

      const created = { name: 'RG', code: 'RG-001' } as DocumentType;

      jest.spyOn(repository, 'create').mockReturnValue(created);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.createRepositoryType(dto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findRepositoryTypes', () => {
    it('should return a list of document types', async () => {
      const documentTypes = [{ id: 1 }, { id: 2 }] as DocumentType[];
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(documentTypes);

      const result = await repository.findRepositoryTypes();

      expect(findSpy).toHaveBeenCalledWith();
      expect(result).toEqual(documentTypes);
    });

    it('should return an empty array when there are no document types', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await repository.findRepositoryTypes();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw an error when find fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.findRepositoryTypes()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteRepositoryType', () => {
    it('should soft delete a document type successfully', async () => {
      const softDeleteSpy = jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({} as UpdateResult);

      await repository.deleteRepositoryType('1');

      expect(softDeleteSpy).toHaveBeenCalledWith('1');
    });

    it('should throw an error when soft delete fails', async () => {
      jest
        .spyOn(repository, 'softDelete')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.deleteRepositoryType('1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
