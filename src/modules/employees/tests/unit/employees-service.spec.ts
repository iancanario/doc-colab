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

    it('should throw InternalServerErrorException when repository fails', async () => {
      const dto: CreateEmployeeDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        documentTypeIds: [1],
      } as CreateEmployeeDTO;

      employeesRepository.createEmployee.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createEmployee(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
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

    it('should throw InternalServerErrorException when repository fails', async () => {
      employeesRepository.findEmployees.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findEmployees()).rejects.toThrow(
        InternalServerErrorException,
      );
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

    it('should throw InternalServerErrorException when repository fails', async () => {
      employeesRepository.findEmployeeById.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findEmployeeById('emp-1')).rejects.toThrow(
        InternalServerErrorException,
      );
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

    it('should throw InternalServerErrorException when repository fails', async () => {
      const dto: UpdateEmployeeDTO = {
        name: 'Jane Doe',
      } as UpdateEmployeeDTO;

      employeesRepository.updateEmployee.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.updateEmployee('emp-1', dto)).rejects.toThrow(
        InternalServerErrorException,
      );
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
      employeesRepository.deleteEmployee.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.deleteEmployee('emp-1')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(employeesRepository.deleteEmployee).toHaveBeenCalledWith('emp-1');
    });
  });
});
