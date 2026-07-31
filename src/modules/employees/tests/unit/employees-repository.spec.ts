import { DataSource, In, UpdateResult } from 'typeorm';
import { EmployeesRepository } from '../../repositories/employees.repository';
import { Employee } from '../../entities/employee.entity';
import { EmployeeDocumentRequirement } from '../../../employee-document-requirements/entities/employee-document-requirement.entity';
import { DocumentType } from '../../../document-types/entities/document-type.entity';
import { CreateEmployeeDTO } from '../../dtos/create-employee.dto';
import { UpdateEmployeeDTO } from '../../dtos/update-employee.dto';

describe('EmployeesRepository', () => {
  let repository: EmployeesRepository;
  let dataSource: jest.Mocked<DataSource>;

  let employeeRepositoryMock: any;
  let requirementRepositoryMock: any;
  let documentTypeRepositoryMock: any;

  const mockManagerGetRepository = (entity: any) => {
    if (entity === Employee) return employeeRepositoryMock;
    if (entity === EmployeeDocumentRequirement)
      return requirementRepositoryMock;
    if (entity === DocumentType) return documentTypeRepositoryMock;
    return undefined;
  };

  beforeEach(() => {
    employeeRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    requirementRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      softDelete: jest.fn(),
    };

    documentTypeRepositoryMock = {
      findBy: jest.fn(),
    };

    dataSource = {
      createEntityManager: jest.fn(),
      transaction: jest.fn().mockImplementation(async (cb) =>
        cb({
          getRepository: jest.fn().mockImplementation(mockManagerGetRepository),
        }),
      ),
    } as unknown as jest.Mocked<DataSource>;

    repository = new EmployeesRepository(dataSource);
  });

  describe('createEmployee', () => {
    it('should create an employee and its document requirements successfully', async () => {
      const dto: CreateEmployeeDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        documentTypeIds: [1, 2],
      } as CreateEmployeeDTO;

      const employeeCreated = {
        name: 'John Doe',
        email: 'john@example.com',
      } as Employee;
      const employeeSaved = {
        id: 'emp-1',
        name: 'John Doe',
        email: 'john@example.com',
      } as Employee;
      const documentTypes = [{ id: 1 }, { id: 2 }] as DocumentType[];
      const requirementsCreated = [
        { employee: employeeSaved, documentType: documentTypes[0] },
        { employee: employeeSaved, documentType: documentTypes[1] },
      ];

      employeeRepositoryMock.create.mockReturnValue(employeeCreated);
      employeeRepositoryMock.save.mockResolvedValue(employeeSaved);
      documentTypeRepositoryMock.findBy.mockResolvedValue(documentTypes);
      requirementRepositoryMock.create.mockImplementation((data: any) => data);
      requirementRepositoryMock.save.mockResolvedValue(requirementsCreated);

      const result = await repository.createEmployee(dto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(employeeRepositoryMock.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(employeeRepositoryMock.save).toHaveBeenCalledWith(employeeCreated);
      expect(documentTypeRepositoryMock.findBy).toHaveBeenCalledWith({
        id: In([1, 2]),
      });
      expect(requirementRepositoryMock.create).toHaveBeenCalledTimes(2);
      expect(requirementRepositoryMock.save).toHaveBeenCalledWith(
        requirementsCreated,
      );
      expect(result).toEqual(employeeSaved);
    });

    it('should throw an error when the transaction fails', async () => {
      const dto: CreateEmployeeDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        documentTypeIds: [1],
      } as CreateEmployeeDTO;

      (dataSource.transaction as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.createEmployee(dto)).rejects.toThrow(
        'Database error',
      );
      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('findEmployees', () => {
    it('should return a list of employees', async () => {
      const employees = [{ id: 'emp-1' }, { id: 'emp-2' }] as Employee[];
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(employees);

      const result = await repository.findEmployees();

      expect(findSpy).toHaveBeenCalledWith();
      expect(result).toEqual(employees);
    });

    it('should return an empty array when there are no employees', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await repository.findEmployees();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findEmployeeById', () => {
    it('should return the employee when found', async () => {
      const employee = { id: 'emp-1' } as Employee;
      const findOneSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(employee);

      const result = await repository.findEmployeeById('emp-1');

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 'emp-1' } });
      expect(result).toEqual(employee);
    });

    it('should return null when the employee is not found', async () => {
      const findOneSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null);

      const result = await repository.findEmployeeById('non-existent-id');

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateEmployee', () => {
    it('should update employee data when name or email is provided', async () => {
      const dto: UpdateEmployeeDTO = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      } as UpdateEmployeeDTO;

      requirementRepositoryMock.find.mockResolvedValue([]);

      const result = await repository.updateEmployee('emp-1', dto);

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
      expect(employeeRepositoryMock.update).toHaveBeenCalledWith('emp-1', {
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      expect(result).toBe(true);
    });

    it('should not update employee data when name and email are not provided', async () => {
      const dto: UpdateEmployeeDTO = {} as UpdateEmployeeDTO;

      const result = await repository.updateEmployee('emp-1', dto);

      expect(employeeRepositoryMock.update).not.toHaveBeenCalled();
      expect(requirementRepositoryMock.find).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should add new document requirements and remove obsolete ones', async () => {
      const dto: UpdateEmployeeDTO = {
        documentTypeIds: [2, 3],
      } as UpdateEmployeeDTO;

      const currentRequirements = [
        { documentType: { id: 1 } },
        { documentType: { id: 2 } },
      ];

      requirementRepositoryMock.find.mockResolvedValue(currentRequirements);
      requirementRepositoryMock.create.mockImplementation((data: any) => data);
      requirementRepositoryMock.save.mockResolvedValue([]);
      requirementRepositoryMock.softDelete.mockResolvedValue(
        {} as UpdateResult,
      );

      const result = await repository.updateEmployee('emp-1', dto);

      expect(requirementRepositoryMock.find).toHaveBeenCalledWith({
        where: { employee: { id: 'emp-1' } },
        relations: { documentType: true },
      });
      expect(requirementRepositoryMock.create).toHaveBeenCalledWith({
        employee: { id: 'emp-1' },
        documentType: { id: 3 },
      });
      expect(requirementRepositoryMock.save).toHaveBeenCalledWith([
        { employee: { id: 'emp-1' }, documentType: { id: 3 } },
      ]);
      expect(requirementRepositoryMock.softDelete).toHaveBeenCalledWith({
        employee: { id: 'emp-1' },
        documentType: In([1]),
      });
      expect(result).toBe(true);
    });

    it('should not add or remove requirements when documentTypeIds matches current ones', async () => {
      const dto: UpdateEmployeeDTO = {
        documentTypeIds: [1],
      } as UpdateEmployeeDTO;

      const currentRequirements = [{ documentType: { id: 1 } }];
      requirementRepositoryMock.find.mockResolvedValue(currentRequirements);
      requirementRepositoryMock.save.mockResolvedValue([]);
      requirementRepositoryMock.softDelete.mockResolvedValue(
        {} as UpdateResult,
      );

      const result = await repository.updateEmployee('emp-1', dto);

      expect(requirementRepositoryMock.create).not.toHaveBeenCalled();
      expect(requirementRepositoryMock.save).toHaveBeenCalledWith([]);
      expect(requirementRepositoryMock.softDelete).toHaveBeenCalledWith({
        employee: { id: 'emp-1' },
        documentType: In([]),
      });
      expect(result).toBe(true);
    });

    it('should throw an error when the transaction fails', async () => {
      const dto: UpdateEmployeeDTO = {
        name: 'Jane Doe',
      } as UpdateEmployeeDTO;

      (dataSource.transaction as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.updateEmployee('emp-1', dto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteEmployee', () => {
    it('should soft delete the employee successfully', async () => {
      const softDeleteSpy = jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({} as UpdateResult);

      await repository.deleteEmployee('emp-1');

      expect(softDeleteSpy).toHaveBeenCalledWith('emp-1');
    });

    it('should throw an error when soft delete fails', async () => {
      jest
        .spyOn(repository, 'softDelete')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.deleteEmployee('emp-1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
