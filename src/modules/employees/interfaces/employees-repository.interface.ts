import { UpdateResult } from 'typeorm';
import { CreateEmployeeDTO } from '../dtos/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';

export abstract class IEmployeesRepository {
  abstract createEmployee(employee: CreateEmployeeDTO): Promise<Employee>;
  abstract findEmployees(): Promise<Employee[]>;
  abstract findEmployeeById(id: string): Promise<Employee | null>;
  abstract updateEmployee(
    id: string,
    update: UpdateEmployeeDTO,
  ): Promise<UpdateResult>;
  abstract deleteEmployee(id: string): Promise<void>;
}
