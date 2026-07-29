import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { IEmployeesRepository } from './interfaces/employees-repository.interface';
import { EmployeesRepository } from './employees.repository';
import { IEmployeesService } from './interfaces/employees-service.intreface';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { EmployeeDocumentRequirement } from './entities/employee-document-requirement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      DocumentType,
      EmployeeDocumentRequirement,
    ]),
  ],
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
