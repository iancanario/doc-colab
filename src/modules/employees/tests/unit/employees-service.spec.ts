import { InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees.service';
import { IEmployeesRepository } from '../../interfaces/employees-repository.interface';
import { Employee } from '../../entities/employee.entity';
import { CreateEmployeeDTO } from '../../dtos/create-employee.dto';
import { UpdateEmployeeDTO } from '../../dtos/update-employee.dto';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeesRepository: jest.Mocked<IEmployeesRepository>;

  beforeEach(() => {
    employeesRepository = {
      createEmployee: jest.fn(),
      findEmployees: jest.fn(),
      findEmployeeById: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
    } as jest.Mocked<IEmployeesRepository>;

    service = new EmployeesService(employeesRepository);
  });

  describe('createEmployee', () => {
    it('should create an employee successfully', async () => {
      const dto: CreateEmployeeDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        documentTypeIds: [1],
      } as CreateEmployeeDTO;

      employeesRepository.createEmployee.mockResolvedValue({} as Employee);

      const result = await service.createEmployee(dto);

      expect(employeesRepository.createEmployee).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Create employee successfully' });
    });

    it('should propagate repository error when creating an employee', async () => {
      const dto: CreateEmployeeDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        documentTypeIds: [1],
      } as CreateEmployeeDTO;

      const error = new Error('Database error');

      employeesRepository.createEmployee.mockRejectedValue(error);

      await expect(service.createEmployee(dto)).rejects.toBe(error);
      expect(employeesRepository.createEmployee).toHaveBeenCalledWith(dto);
    });
  });

  describe('findEmployees', () => {
    it('should return a list of employees successfully', async () => {
      const employees = [{ id: 'emp-1' }, { id: 'emp-2' }] as Employee[];
      employeesRepository.findEmployees.mockResolvedValue(employees);

      const result = await service.findEmployees();

      expect(employeesRepository.findEmployees).toHaveBeenCalledTimes(1);
      expect(result).toEqual(employees);
    });

    it('should propagate repository error when finding employees', async () => {
      const error = new Error('Database error');

      employeesRepository.findEmployees.mockRejectedValue(error);

      await expect(service.findEmployees()).rejects.toBe(error);
      expect(employeesRepository.findEmployees).toHaveBeenCalledTimes(1);
    });
  });

  describe('findEmployeeById', () => {
    it('should return the employee when found', async () => {
      const employee = { id: 'emp-1' } as Employee;
      employeesRepository.findEmployeeById.mockResolvedValue(employee);

      const result = await service.findEmployeeById('emp-1');

      expect(employeesRepository.findEmployeeById).toHaveBeenCalledWith(
        'emp-1',
      );
      expect(result).toEqual(employee);
    });

    it('should return null when the employee is not found', async () => {
      employeesRepository.findEmployeeById.mockResolvedValue(null);

      const result = await service.findEmployeeById('non-existent-id');

      expect(employeesRepository.findEmployeeById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(result).toBeNull();
    });

    it('should propagate repository error when finding employee by id', async () => {
      const error = new Error('Database error');

      employeesRepository.findEmployeeById.mockRejectedValue(error);

      await expect(service.findEmployeeById('emp-1')).rejects.toBe(error);

      expect(employeesRepository.findEmployeeById).toHaveBeenCalledWith(
        'emp-1',
      );
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      const dto: UpdateEmployeeDTO = {
        name: 'Jane Doe',
      } as UpdateEmployeeDTO;

      employeesRepository.updateEmployee.mockResolvedValue(true);

      const result = await service.updateEmployee('emp-1', dto);

      expect(employeesRepository.updateEmployee).toHaveBeenCalledWith(
        'emp-1',
        dto,
      );
      expect(result).toEqual({ message: 'Update employee successfully' });
    });

    it('should propagate repository error when updating an employee', async () => {
      const dto: UpdateEmployeeDTO = {
        name: 'Jane Doe',
      } as UpdateEmployeeDTO;

      const error = new Error('Database error');

      employeesRepository.updateEmployee.mockRejectedValue(error);

      await expect(service.updateEmployee('emp-1', dto)).rejects.toBe(error);
      expect(employeesRepository.updateEmployee).toHaveBeenCalledWith(
        'emp-1',
        dto,
      );
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      employeesRepository.deleteEmployee.mockResolvedValue(undefined);

      const result = await service.deleteEmployee('emp-1');

      expect(employeesRepository.deleteEmployee).toHaveBeenCalledWith('emp-1');
      expect(result).toEqual({ message: 'Delete employee successfully' });
    });

    it('should throw InternalServerErrorException when repository fails', async () => {
      const error = new Error('Database error');

      employeesRepository.deleteEmployee.mockRejectedValue(error);

      await expect(service.deleteEmployee('emp-1')).rejects.toBe(error);
      expect(employeesRepository.deleteEmployee).toHaveBeenCalledWith('emp-1');
    });
  });
});
