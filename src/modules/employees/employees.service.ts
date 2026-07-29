import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      await this.employeesRepository.createEmployee(employee);
      return { message: 'Create employee successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error to create employee', {
        cause: error,
      });
    }
  }

  async findEmployees(): Promise<Employee[]> {
    try {
      return await this.employeesRepository.findEmployees();
    } catch (error) {
      throw new InternalServerErrorException('Error to find employees', {
        cause: error,
      });
    }
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    try {
      return await this.employeesRepository.findEmployeeById(id);
    } catch (error) {
      throw new InternalServerErrorException('Error to find employee', {
        cause: error,
      });
    }
  }

  async updateEmployee(
    id: string,
    update: UpdateEmployeeDTO,
  ): Promise<{ message: string }> {
    try {
      await this.employeesRepository.updateEmployee(id, update);
      return { message: 'Update employee successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error to find employee', {
        cause: error,
      });
    }
  }

  async deleteEmployee(id: string): Promise<{ message: string }> {
    try {
      await this.employeesRepository.deleteEmployee(id);
      return { message: 'Delete employee successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error to delete employee', {
        cause: error,
      });
    }
  }
}
