import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeeDocument } from './entities/employee-document.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';
import { EmployeeDocumentsController } from './employeeDocument.controller';
import { IEmployeeDocumentService } from './interfaces/employee-document-service.interface';
import { EmployeeDocumentsService } from './employeeDocuments.service';
import { IEmployeeDocumentsRepository } from './interfaces/employee-document-repository.interface';
import { EmployeeDocumentsRepository } from './repositories/employeeDocuments.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, EmployeeDocument, DocumentType]),
  ],
  controllers: [EmployeeDocumentsController],
  providers: [
    {
      provide: IEmployeeDocumentService,
      useClass: EmployeeDocumentsService,
    },
    {
      provide: IEmployeeDocumentsRepository,
      useClass: EmployeeDocumentsRepository,
    },
  ],
})
export class EmployeeDocumentModule {}
