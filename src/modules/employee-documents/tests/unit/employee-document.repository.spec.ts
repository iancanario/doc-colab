import { DataSource, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeeDocumentsRepository } from '../../repositories/employeeDocuments.repository';
import { EmployeeDocument } from '../../entities/employee-document.entity';
import { CreateEmployeeDocumentDTO } from '../../dtos/create-employee-document.dto';
import { EmployeeDocumentRequirement } from '../../../employee-document-requirements/entities/employee-document-requirement.entity';
import { DocumentStatusEnum } from '../../../../common/enums/document-status.enum';

describe('EmployeeDocumentsRepository', () => {
  let repository: EmployeeDocumentsRepository;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    dataSource = {
      createEntityManager: jest.fn(),
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    repository = new EmployeeDocumentsRepository(dataSource);
  });

  describe('createEmployeeDocument', () => {
    it('should create employee document successfully', async () => {
      const dto: CreateEmployeeDocumentDTO = {
        requirementId: 1,
        documentUrl: 'document.pdf',
      } as CreateEmployeeDocumentDTO;

      const requirement = {
        id: 1,
        employee: {},
        documentType: {},
      } as EmployeeDocumentRequirement;

      const document = {
        requirement,
        documentUrl: dto.documentUrl,
        version: 1,
        isActive: true,
      } as EmployeeDocument;

      const transactionManager = {
        getRepository: jest.fn(),
      };

      const requirementRepository = {
        findOne: jest.fn().mockResolvedValue(requirement),
        update: jest.fn().mockResolvedValue({}),
      };

      const documentRepository = {
        update: jest.fn().mockResolvedValue({}),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn().mockReturnValue(document),
        save: jest.fn().mockResolvedValue(document),
      };

      transactionManager.getRepository
        .mockReturnValueOnce(documentRepository)
        .mockReturnValueOnce(requirementRepository);

      dataSource.transaction.mockImplementation(async (callback) =>
        callback(transactionManager as any),
      );

      const result = await repository.createEmployeeDocument(dto);

      expect(requirementRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: dto.requirementId,
        },
        relations: {
          employee: true,
          documentType: true,
        },
      });

      expect(documentRepository.update).toHaveBeenCalledWith(
        {
          requirement: {
            id: requirement.id,
          },
          isActive: true,
        },
        {
          isActive: false,
        },
      );

      expect(documentRepository.count).toHaveBeenCalledWith({
        where: {
          requirement: {
            id: requirement.id,
          },
        },
        withDeleted: true,
      });

      expect(documentRepository.create).toHaveBeenCalledWith({
        requirement,
        documentUrl: dto.documentUrl,
        version: 1,
        isActive: true,
      });

      expect(requirementRepository.update).toHaveBeenCalledWith(
        requirement.id,
        {
          status: DocumentStatusEnum.Sent,
        },
      );

      expect(documentRepository.save).toHaveBeenCalledWith(document);
      expect(result).toEqual(document);
    });

    it('should throw NotFoundException when requirement does not exist', async () => {
      const dto: CreateEmployeeDocumentDTO = {
        requirementId: 1,
        documentUrl: 'document.pdf',
      } as CreateEmployeeDocumentDTO;

      const transactionManager = {
        getRepository: jest.fn(),
      };

      const requirementRepository = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const documentRepository = {};

      transactionManager.getRepository
        .mockReturnValueOnce(documentRepository)
        .mockReturnValueOnce(requirementRepository);

      dataSource.transaction.mockImplementation(async (callback) =>
        callback(transactionManager as any),
      );

      await expect(repository.createEmployeeDocument(dto)).rejects.toThrow(
        new NotFoundException('Requirement not found'),
      );
    });

    it('should throw error when transaction fails', async () => {
      const dto = {
        requirementId: 1,
        documentUrl: 'document.pdf',
      } as CreateEmployeeDocumentDTO;

      dataSource.transaction.mockRejectedValue(new Error('Database error'));

      await expect(repository.createEmployeeDocument(dto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findLastSents', () => {
    it('should return the last sent documents', async () => {
      const documents = [{ id: 1 }, { id: 2 }] as EmployeeDocument[];

      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(documents);

      const result = await repository.findLastSents();

      expect(findSpy).toHaveBeenCalledWith({
        relations: {
          requirement: {
            employee: true,
            documentType: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: 10,
      });

      expect(result).toEqual(documents);
    });

    it('should throw error when find fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.findLastSents()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteEmployeeDocument', () => {
    it('should delete employee document successfully', async () => {
      const transactionManager = {
        getRepository: jest.fn(),
      };

      const documentRepository = {
        update: jest.fn().mockResolvedValue({}),
        softDelete: jest.fn().mockResolvedValue({} as UpdateResult),
      };

      transactionManager.getRepository.mockReturnValue(documentRepository);

      dataSource.transaction.mockImplementation(async (callback) =>
        callback(transactionManager as any),
      );

      await repository.deleteEmployeeDocument('1');

      expect(documentRepository.update).toHaveBeenCalledWith('1', {
        isActive: false,
      });

      expect(documentRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw error when delete fails', async () => {
      dataSource.transaction.mockRejectedValue(new Error('Database error'));

      await expect(repository.deleteEmployeeDocument('1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
