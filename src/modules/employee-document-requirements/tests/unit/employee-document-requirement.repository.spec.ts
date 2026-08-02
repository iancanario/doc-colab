import { DataSource } from 'typeorm';
import { EmployeeDocumentRequirementsRepository } from '../../repositories/employee-document-requirement.repository';
import { EmployeeDocumentRequirement } from '../../entities/employee-document-requirement.entity';
import { FindPendingDocumentsDTO } from '../../dtos/find-pending-documents.dto';
import { DocumentStatusEnum } from '../../../../common/enums/document-status.enum';

describe('EmployeeDocumentRequirementsRepository', () => {
  let repository: EmployeeDocumentRequirementsRepository;
  let dataSource: jest.Mocked<DataSource>;
  let queryBuilderMock: any;

  beforeEach(() => {
    queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    dataSource = {
      createEntityManager: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    repository = new EmployeeDocumentRequirementsRepository(dataSource);
  });

  describe('findPendingDocuments', () => {
    it('should return paginated pending documents with default filters', async () => {
      const filters: FindPendingDocumentsDTO = {} as FindPendingDocumentsDTO;
      const requirements = [{ id: 1 }] as EmployeeDocumentRequirement[];

      const createQueryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock);
      queryBuilderMock.getManyAndCount.mockResolvedValue([requirements, 1]);

      const result = await repository.findPendingDocuments(filters);

      expect(createQueryBuilderSpy).toHaveBeenCalledWith('requirement');
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'requirement.deleted_at IS NULL',
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'requirement.status = :status',
        { status: DocumentStatusEnum.Pending },
      );
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        data: requirements,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply employeeId and documentTypeId filters and calculate pagination', async () => {
      const filters: FindPendingDocumentsDTO = {
        page: 2,
        limit: 5,
        employeeId: 'emp-1',
        documentTypeId: 'dt-1',
      } as FindPendingDocumentsDTO;

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock);
      queryBuilderMock.getManyAndCount.mockResolvedValue([[], 12]);

      const result = await repository.findPendingDocuments(filters);

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'requirement.status = :status',
        { status: DocumentStatusEnum.Pending },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'employee.id = :employeeId',
        { employeeId: 'emp-1' },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'documentType.id = :documentTypeId',
        { documentTypeId: 'dt-1' },
      );
      expect(queryBuilderMock.take).toHaveBeenCalledWith(5);
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);
      expect(result).toEqual({
        data: [],
        meta: { total: 12, page: 2, limit: 5, totalPages: 3 },
      });
    });

    it('should throw an error when the query fails', async () => {
      const filters: FindPendingDocumentsDTO = {} as FindPendingDocumentsDTO;

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock);
      queryBuilderMock.getManyAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.findPendingDocuments(filters)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('percentualSentDocuments', () => {
    it('should calculate the percentage of sent documents', async () => {
      const countSpy = jest
        .spyOn(repository, 'count')
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(4);

      const result = await repository.percentualSentDocuments();

      expect(countSpy).toHaveBeenNthCalledWith(1);
      expect(countSpy).toHaveBeenNthCalledWith(2, {
        where: { status: DocumentStatusEnum.Sent },
      });
      expect(result).toBe(40);
    });

    it('should return 0 when there are no requirements', async () => {
      jest
        .spyOn(repository, 'count')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await repository.percentualSentDocuments();

      expect(result).toBe(0);
    });

    it('should throw an error when count fails', async () => {
      jest
        .spyOn(repository, 'count')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.percentualSentDocuments()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('mostDocumentsPendings', () => {
    it('should return the top 3 document types with the most pending documents', async () => {
      const rawResult = [
        { id: 'dt-1', name: 'RG', pending: '5' },
        { id: 'dt-2', name: 'CPF', pending: '3' },
      ];

      const createQueryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock);
      queryBuilderMock.getRawMany.mockResolvedValue(rawResult);

      const result = await repository.mostDocumentsPendings();

      expect(createQueryBuilderSpy).toHaveBeenCalledWith('requirement');
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'requirement.status = :status',
        { status: DocumentStatusEnum.Pending },
      );
      expect(queryBuilderMock.groupBy).toHaveBeenCalledWith('documentType.id');
      expect(queryBuilderMock.addGroupBy).toHaveBeenCalledWith(
        'documentType.name',
      );
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('pending', 'DESC');
      expect(queryBuilderMock.limit).toHaveBeenCalledWith(3);
      expect(result).toEqual(rawResult);
    });

    it('should throw an error when the query fails', async () => {
      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock);
      queryBuilderMock.getRawMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.mostDocumentsPendings()).rejects.toThrow(
        'Database error',
      );
    });
  });
});
