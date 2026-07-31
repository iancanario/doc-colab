import { DataSource, UpdateResult } from 'typeorm';
import { EmployeesRepository } from '../../repositories/employees.repository';
import { Employee } from '../../entities/employee.entity';
import { EmployeeDocumentRequirement } from '../../../employee-document-requirements/entities/employee-document-requirement.entity';
import { DocumentType } from '../../../../modules/document-types/entities/document-type.entity';

describe('EmployeesRepository', () => {
  let repository: EmployeesRepository;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    dataSource = {
      createEntityManager: jest.fn(),
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    repository = new EmployeesRepository(dataSource);
  });

  describe('createEmployee', () => {
    const employeeRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const documentTypeRepository = {
      findBy: jest.fn(),
    };

    const requirementRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const manager = {
      getRepository: jest.fn(),
    };

    beforeEach(() => {
      manager.getRepository.mockImplementation((entity) => {
        if (entity === Employee) return employeeRepository;
        if (entity === DocumentType) return documentTypeRepository;
        if (entity === EmployeeDocumentRequirement) {
          return requirementRepository;
        }

        throw new Error('Repository not mocked');
      });

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementation(async (callback: any) => callback(manager));
    });

    it('should create employee and document requirements', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@email.com',
        documentTypeIds: [1, 2],
      };

      const employee = {
        id: 'employee-id',
        name: dto.name,
        email: dto.email,
      } as Employee;

      employeeRepository.create.mockReturnValue(employee);
      employeeRepository.save.mockResolvedValue(employee);

      documentTypeRepository.findBy.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);

      requirementRepository.create
        .mockReturnValueOnce({})
        .mockReturnValueOnce({});

      requirementRepository.save.mockResolvedValue([]);

      const result = await repository.createEmployee(dto);

      expect(employeeRepository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
      });

      expect(employeeRepository.save).toHaveBeenCalledWith(employee);

      expect(documentTypeRepository.findBy).toHaveBeenCalled();

      expect(requirementRepository.create).toHaveBeenCalledTimes(2);

      expect(requirementRepository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(employee);
    });
  });

  describe('findEmployees', () => {
    it('should return all employees', async () => {
      const employees = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Doe' },
      ] as Employee[];

      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(employees);

      const result = await repository.findEmployees();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employees);
    });
  });

  describe('findEmployeeById', () => {
    it('should return an employee by id', async () => {
      const employee = {
        id: '1',
        name: 'John Doe',
      } as Employee;

      const findOneSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(employee);

      const result = await repository.findEmployeeById('1');

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(employee);
    });

    it('should return null when employee is not found', async () => {
      const findOneSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null);

      const result = await repository.findEmployeeById('999');

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: '999' },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const dto = {
        name: 'Updated Name',
      };

      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };

      const updateSpy = jest
        .spyOn(repository, 'update')
        .mockResolvedValue(updateResult);

      const result = await repository.updateEmployee('1', dto);

      expect(updateSpy).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const deleteSpy = jest.spyOn(repository, 'delete').mockResolvedValue({
        affected: 1,
        raw: {},
      });

      await repository.deleteEmployee('1');

      expect(deleteSpy).toHaveBeenCalledWith('1');
    });
  });
});
