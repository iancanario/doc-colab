import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { IEmployeesRepository } from '../interfaces/employees-repository.interface';
import { CreateEmployeeDTO } from '../dtos/create-employee.dto';
import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';
import { DocumentType } from '../../document-types/entities/document-type.entity';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';

@Injectable()
export class EmployeesRepository
  extends Repository<Employee>
  implements IEmployeesRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }

  async createEmployee(employeeDto: CreateEmployeeDTO): Promise<Employee> {
    return this.dataSource.transaction(async (manager) => {
      const { documentTypeIds, ...employeeData } = employeeDto;

      const employeeRepository = manager.getRepository(Employee);
      const requirementRepository = manager.getRepository(
        EmployeeDocumentRequirement,
      );
      const documentTypeRepository = manager.getRepository(DocumentType);

      const employee = await employeeRepository.save(
        employeeRepository.create(employeeData),
      );

      const documentTypes = await documentTypeRepository.findBy({
        id: In(documentTypeIds),
      });

      const requirements = documentTypes.map((documentType) =>
        requirementRepository.create({
          employee,
          documentType,
        }),
      );

      await requirementRepository.save(requirements);

      return employee;
    });
  }

  async findEmployees(): Promise<Employee[]> {
    return this.find();
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return await this.findOne({ where: { id } });
  }

  async findEmployeeByEmail(email: string): Promise<Employee | null> {
    return await this.findOne({ where: { email } });
  }

  async updateEmployee(id: string, updateDto: UpdateEmployeeDTO): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      const { documentTypeIds, ...employeeData } = updateDto;

      const employeeRepository = manager.getRepository(Employee);
      const requirementRepository = manager.getRepository(
        EmployeeDocumentRequirement,
      );
      if (employeeData.email || employeeData.name) {
        await employeeRepository.update(id, employeeData);
      }

      if (documentTypeIds) {
        const currentRequirements = await requirementRepository.find({
          where: {
            employee: {
              id,
            },
          },
          relations: {
            documentType: true,
          },
        });

        const currentIds = currentRequirements.map((r) => r.documentType.id);

        const idsToAdd = documentTypeIds.filter(
          (id) => !currentIds.includes(id),
        );

        const idsToRemove = currentIds.filter(
          (id) => !documentTypeIds.includes(id),
        );

        const requirements = idsToAdd.map((documentTypeId) =>
          requirementRepository.create({
            employee: {
              id,
            },
            documentType: {
              id: documentTypeId,
            },
          }),
        );

        await requirementRepository.save(requirements);

        await requirementRepository.softDelete({
          employee: {
            id,
          },
          documentType: In(idsToRemove),
        });
      }

      return true;
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.softDelete(id);
  }
}
