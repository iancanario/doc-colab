import { DataSource, UpdateResult } from 'typeorm';
import { EmployeesRepository } from '../../employees.repository';
import { Employee } from '../../entities/employee.entity';

describe('EmployeesRepository', () => {
  let repository: EmployeesRepository;

  beforeEach(() => {
    const dataSource = {
      createEntityManager: jest.fn(),
    } as unknown as DataSource;

    repository = new EmployeesRepository(dataSource);
  });

  describe('createEmployee', () => {
    it('should create and save an employee', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john.doe@email.com',
      };

      const entity = dto as Employee;

      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(entity);

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(entity);

      const result = await repository.createEmployee(dto);

      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(saveSpy).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
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
