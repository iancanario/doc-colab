import { DataSource } from 'typeorm';
import { DocumentTypesRepository } from '../../documentTypes.repository';
import { DocumentType } from '../../entities/documentType.entity';

describe('DocumentTypesRepository', () => {
  let repository: DocumentTypesRepository;

  beforeEach(() => {
    const dataSource = {
      createEntityManager: jest.fn(),
    } as unknown as DataSource;

    repository = new DocumentTypesRepository(dataSource);
  });

  describe('createRepositoryType', () => {
    it('should create and save a document type', async () => {
      const dto = {
        name: 'Contrato',
        code: 'Contract'
      };

      const entity = dto as DocumentType;

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(entity);

      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(entity);

      const result = await repository.createRepositoryType(dto);

      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });
  });

  describe('findRepositoryTypes', () => {
    it('should return all document types', async () => {
      const documentTypes = [
        { id: '1', name: 'Contrato' },
        { id: '2', name: 'CNH' },
      ] as DocumentType[];

      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(documentTypes);

      const result = await repository.findRepositoryTypes();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(documentTypes);
    });
  });

  describe('deleteRepositoryType', () => {
    it('should soft delete a document type', async () => {
      const softDeleteSpy = jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({
          affected: 1,
          raw: {},
          generatedMaps: [],
        });

      await repository.deleteRepositoryType('1');

      expect(softDeleteSpy).toHaveBeenCalledWith('1');
    });
  });
});