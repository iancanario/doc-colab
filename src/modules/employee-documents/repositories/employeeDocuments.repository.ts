import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { EmployeeDocument } from '../entities/employee-document.entity';
import { IEmployeeDocumentsRepository } from '../interfaces/employee-document-repository.interface';
import { CreateEmployeeDocumentDTO } from '../dtos/create-employee-document.dto';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';
import { DocumentStatusEnum } from 'src/common/enums/document-status.enum';

@Injectable()
export class EmployeeDocumentsRepository
  extends Repository<EmployeeDocument>
  implements IEmployeeDocumentsRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(EmployeeDocument, dataSource.createEntityManager());
  }

  async createEmployeeDocument(
    dto: CreateEmployeeDocumentDTO,
  ): Promise<EmployeeDocument> {
    return this.dataSource.transaction(async (manager) => {
      const documentRepository = manager.getRepository(EmployeeDocument);
      const requirementRepository = manager.getRepository(
        EmployeeDocumentRequirement,
      );

      const requirement = await requirementRepository.findOne({
        where: {
          id: dto.requirementId,
        },
        relations: {
          employee: true,
          documentType: true,
        },
      });

      if (!requirement) {
        throw new NotFoundException('Requirement not found');
      }

      await documentRepository.update(
        {
          requirement: {
            id: requirement.id,
          },
          isActive: true,
        },
        {
          isActive: false,
        },
      );

      const lastVersion = await documentRepository.count({
        where: {
          requirement: {
            id: requirement.id,
          },
        },
        withDeleted: true,
      });

      const document = documentRepository.create({
        requirement,
        documentUrl: dto.documentUrl,
        version: lastVersion + 1,
        isActive: true,
      });

      await requirementRepository.update(requirement.id, {
        status: DocumentStatusEnum.Sent,
      });

      return documentRepository.save(document);
    });
  }

  async findLastSents(): Promise<EmployeeDocument[]> {
    return this.find({
      relations: {
        requirement: {
          employee: true,
          documentType: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
  }

  async deleteEmployeeDocument(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(EmployeeDocument);

      await repository.update(id, {
        isActive: false,
      });

      await repository.softDelete(id);
    });
  }
}
