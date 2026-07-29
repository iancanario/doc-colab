import { InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees.service';
import { IEmployeesRepository } from '../../interfaces/employees-repository.interface';
import { Employee } from '../../entities/employee.entity';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: jest.Mocked<IEmployeesRepository>;

  beforeEach(() => {
    repository = {
      createEmployee: jest.fn(),
      findEmployees: jest.fn(),
      findEmployeeById: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
    } as jest.Mocked<IEmployeesRepository>;

    service = new EmployeesService(repository);
  });

  describe('createEmployee', () => {
    it('should create an employee successfully', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@email.com',
      };

      repository.createEmployee.mockResolvedValue({} as Employee);

      const result = await service.createEmployee(dto);

      expect(repository.createEmployee).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Create employee successfully',
      });
    });

    it('should throw InternalServerErrorException', async () => {
      repository.createEmployee.mockRejectedValue(new Error('Database error'));

      await expect(service.createEmployee({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(repository.createEmployee).toHaveBeenCalled();
    });
  });

  describe('findEmployees', () => {
    it('should return all employees', async () => {
      const employees = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Doe' },
      ] as Employee[];

      repository.findEmployees.mockResolvedValue(employees);

      const result = await service.findEmployees();

      expect(repository.findEmployees).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employees);
    });

    it('should throw InternalServerErrorException', async () => {
      repository.findEmployees.mockRejectedValue(new Error());

      await expect(service.findEmployees()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findEmployeeById', () => {
    it('should return an employee', async () => {
      const employee = {
        id: '1',
        name: 'John Doe',
      } as Employee;

      repository.findEmployeeById.mockResolvedValue(employee);

      const result = await service.findEmployeeById('1');

      expect(repository.findEmployeeById).toHaveBeenCalledWith('1');
      expect(result).toEqual(employee);
    });

    it('should return null', async () => {
      repository.findEmployeeById.mockResolvedValue(null);

      const result = await service.findEmployeeById('1');

      expect(repository.findEmployeeById).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException', async () => {
      repository.findEmployeeById.mockRejectedValue(new Error());

      await expect(service.findEmployeeById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const dto = {
        name: 'Updated Name',
      };

      repository.updateEmployee.mockResolvedValue({} as any);

      const result = await service.updateEmployee('1', dto);

      expect(repository.updateEmployee).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual({
        message: 'Update employee successfully',
      });
    });

    it('should throw InternalServerErrorException', async () => {
      repository.updateEmployee.mockRejectedValue(new Error());

      await expect(service.updateEmployee('1', {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      repository.deleteEmployee.mockResolvedValue();

      const result = await service.deleteEmployee('1');

      expect(repository.deleteEmployee).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Delete employee successfully',
      });
    });

    it('should throw InternalServerErrorException', async () => {
      repository.deleteEmployee.mockRejectedValue(new Error());

      await expect(service.deleteEmployee('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
