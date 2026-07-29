import { DocumentType } from '../../../modules/document-types/entities/document-type.entity';
import { DocumentStatusEnum } from '../../../common/enums/document-status.enum';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employee_document_requirements')
export class EmployeeDocumentRequirement {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'enum',
    enum: DocumentStatusEnum,
    default: DocumentStatusEnum.Pending,
  })
  status!: DocumentStatusEnum;

  @ManyToOne(() => Employee, (employee) => employee.documentRequirements)
  employee!: Employee;

  @ManyToOne(() => DocumentType)
  documentType!: DocumentType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
