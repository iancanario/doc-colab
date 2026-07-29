import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { IEmployeesRepository } from './interfaces/employees-repository.interface';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';

@Injectable()
export class EmployeesRepository
  extends Repository<Employee>
  implements IEmployeesRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }

  async createEmployee(employee: CreateEmployeeDTO): Promise<Employee> {
    const newEmployee = this.create(employee);
    return await this.save(newEmployee);
  }

  async findEmployees(): Promise<Employee[]> {
    return this.find();
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return await this.findOne({ where: { id } });
  }

  async updateEmployee(
    id: string,
    update: UpdateEmployeeDTO,
  ): Promise<UpdateResult> {
    return await this.update(id, update);
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.delete(id);
  }
}
