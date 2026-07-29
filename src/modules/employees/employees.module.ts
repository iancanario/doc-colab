import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { IEmployeesRepository } from './interfaces/employees-repository.interface';
import { EmployeesRepository } from './employees.repository';
import { IEmployeesService } from './interfaces/employees-service.intreface';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [
    {
      provide: IEmployeesRepository,
      useClass: EmployeesRepository,
    },
    {
      provide: IEmployeesService,
      useClass: EmployeesService,
    },
  ],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
