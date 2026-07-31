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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(
    @Inject(IEmployeesService)
    private readonly employeeService: IEmployeesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar funcionário',
    description: 'Cria um novo funcionário no sistema',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Create employee successfully' },
  })
  create(@Body() employee: CreateEmployeeDTO) {
    return this.employeeService.createEmployee(employee);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar funcionários',
    description: 'lista todos os funcionário do sistema',
  })
  @ApiResponse({
    status: 201,
    type: Employee,
    isArray: true,
  })
  findAll() {
    return this.employeeService.findEmployees();
  }

  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Listar funcionário por id',
    description: 'lista um funcionario baseado no seu id',
  })
  @ApiResponse({
    status: 201,
    type: Employee,
  })
  findById(@Param('id') id: string) {
    return this.employeeService.findEmployeeById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar funcionário',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Update employee successfully' },
  })
  update(@Param('id') id: string, @Body() updateData: UpdateEmployeeDTO) {
    return this.employeeService.updateEmployee(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar funcionário',
  })
  @ApiResponse({
    status: 201,
    example: { message: 'Delete employee successfully' },
  })
  delete(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
