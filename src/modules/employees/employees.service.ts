import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { IEmployeesService } from './interfaces/employees-service.intreface';
import { IEmployeesRepository } from './interfaces/employees-repository.interface';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';

@Injectable()
export class EmployeesService implements IEmployeesService {
  constructor(
    @Inject(IEmployeesRepository)
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  async createEmployee(
    employee: CreateEmployeeDTO,
  ): Promise<{ message: string }> {
    await this.employeesRepository.createEmployee(employee);
    return { message: 'Create employee successfully' };
  }

  async findEmployees(): Promise<Employee[]> {
    return await this.employeesRepository.findEmployees();
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return await this.employeesRepository.findEmployeeById(id);
  }

  async updateEmployee(
    id: string,
    update: UpdateEmployeeDTO,
  ): Promise<{ message: string }> {
    await this.employeesRepository.updateEmployee(id, update);
    return { message: 'Update employee successfully' };
  }

  async deleteEmployee(id: string): Promise<{ message: string }> {
    await this.employeesRepository.deleteEmployee(id);
    return { message: 'Delete employee successfully' };
  }
}
