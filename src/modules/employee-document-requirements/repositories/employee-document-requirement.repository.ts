import { Injectable } from '@nestjs/common';
import { FindPendingDocumentsDTO } from '../dtos/find-pending-documents.dto';
import { DataSource, Repository } from 'typeorm';
import { EmployeeDocument } from '../../employee-documents/entities/employee-document.entity';
import { DocumentStatusEnum } from 'src/common/enums/document-status.enum';
import { EmployeeDocumentRequirement } from '../entities/employee-document-requirement.entity';

@Injectable()
export class EmployeeDocumentRequirementsRepository extends Repository<EmployeeDocumentRequirement> {
  constructor(private readonly dataSource: DataSource) {
    super(EmployeeDocumentRequirement, dataSource.createEntityManager());
  }

  async findPendingDocuments(
    filters: FindPendingDocumentsDTO,
  ): Promise<{ data: EmployeeDocumentRequirement[]; meta: any }> {
    const { page = 1, limit = 10 } = filters;

    const query = this.createQueryBuilder('requirement')
      .leftJoinAndSelect('requirement.employee', 'employee')
      .leftJoinAndSelect('requirement.documentType', 'documentType')
      .leftJoinAndSelect(
        'requirement.documents',
        'document',
        'document.isActive = true',
      );

    query.where('requirement.deleted_at IS NULL');

    query.andWhere('requirement.status = :status', {
      status: DocumentStatusEnum.Pending,
    });

    if (filters.status) {
      query.andWhere('requirement.status = :status', {
        status: filters.status,
      });
    }

    if (filters.employeeId) {
      query.andWhere('employee.id = :employeeId', {
        employeeId: filters.employeeId,
      });
    }

    if (filters.documentTypeId) {
      query.andWhere('documentType.id = :documentTypeId', {
        documentTypeId: filters.documentTypeId,
      });
    }
    query.take(limit).skip((page - 1) * limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async percentualSentDocuments(): Promise<number> {
    const total = await this.count();
    console.log(total);
    const sent = await this.count({
      where: {
        status: DocumentStatusEnum.Sent,
      },
    });

    const pendingPercentage = total === 0 ? 0 : (sent / total) * 100;

    return pendingPercentage;
  }
}
