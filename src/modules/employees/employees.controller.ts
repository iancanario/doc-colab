import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmployeeDTO } from './dtos/create-employee.dto';
import { IEmployeesService } from './interfaces/employees-service.intreface';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(
    @Inject(IEmployeesService)
    private readonly employeeService: IEmployeesService,
  ) {}

  @Post()
  create(@Body() employee: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(employee);
  }

  @Get()
  findAll() {
    return this.employeeService.findEmployees();
  }

  @Get('by-id/:id')
  findById(@Param('id') id: string) {
    return this.employeeService.findEmployeeById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateEmployeeDTO) {
    return this.employeeService.updateEmployee(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
