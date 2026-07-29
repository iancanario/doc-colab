import { CreateEmployeeDTO } from '../dtos/create-employee.dto';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';
import { Employee } from '../entities/employee.entity';

export abstract class IEmployeesService {
  abstract createEmployee(
    employee: CreateEmployeeDTO,
  ): Promise<{ message: string }>;
  abstract findEmployees(): Promise<Employee[]>;
  abstract findEmployeeById(id: string): Promise<Employee | null>;
  abstract updateEmployee(
    id: string,
    update: UpdateEmployeeDTO,
  ): Promise<{ message: string }>;
  abstract deleteEmployee(id: string): Promise<{ message: string }>;
}
