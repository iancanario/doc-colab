import { DocumentType } from '../../document-types/entities/document-type.entity';
import { DocumentStatusEnum } from '../../../common/enums/document-status.enum';
import { Employee } from '../../employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeDocument } from '../../employee-documents/entities/employee-document.entity';

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
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'document_type_id' })
  documentType!: DocumentType;

  @OneToMany(() => EmployeeDocument, (document) => document.requirement, {
    cascade: false,
  })
  documents!: EmployeeDocument[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
