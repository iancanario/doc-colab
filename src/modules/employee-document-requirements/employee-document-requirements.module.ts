import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeeDocumentRequirementsController } from './employee-document-requirements.controller';
import { IEmployeeDocumentRequirementRepository } from './interfaces/employee-document-requirement-repository.interface';
import { EmployeeDocumentRequirementsRepository } from './repositories/employee-document-requirement.repository';
import { IEmployeeDocumentRequirementService } from './interfaces/employee-document-requirement-service.interface';
import { EmployeeDocumentRequirementsService } from './employee-document-requirements.service';
import { EmployeeDocumentRequirement } from './entities/employee-document-requirement.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeDocumentRequirement,
      Employee,
      DocumentType,
    ]),
  ],
  providers: [
    {
      provide: IEmployeeDocumentRequirementRepository,
      useClass: EmployeeDocumentRequirementsRepository,
    },
    {
      provide: IEmployeeDocumentRequirementService,
      useClass: EmployeeDocumentRequirementsService,
    },
  ],
  controllers: [EmployeeDocumentRequirementsController],
})
export class EmployeeDocumentRequirementsModule {}
