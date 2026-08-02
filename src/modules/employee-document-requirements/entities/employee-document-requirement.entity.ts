import { DocumentType } from '../../document-types/entities/document-type.entity';
import { DocumentStatusEnum } from '../../../common/enums/document-status.enum';
import { Employee } from '../../employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeDocument } from '../../employee-documents/entities/employee-document.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index('IDX_requirements_pending_employee', ['employee'], {
  where: `"status" = 'PENDING' AND "deleted_at" IS NULL`,
})
@Index('IDX_requirements_pending_document_type', ['documentType'], {
  where: `"status" = 'PENDING' AND "deleted_at" IS NULL`,
})
@Index(
  'UQ_requirements_active_employee_document_type',
  ['employee', 'documentType'],
  {
    unique: true,
    where: `"deleted_at" IS NULL`,
  },
)
@Entity('employee_document_requirements')
export class EmployeeDocumentRequirement {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty({
    example: DocumentStatusEnum.Pending,
  })
  @Column({
    type: 'enum',
    enum: DocumentStatusEnum,
    default: DocumentStatusEnum.Pending,
  })
  status!: DocumentStatusEnum;

  @ApiProperty({
    type: Employee,
  })
  @ManyToOne(() => Employee, (employee) => employee.documentRequirements)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'document_type_id' })
  documentType!: DocumentType;

  @ApiProperty({
    type: [EmployeeDocument],
  })
  @OneToMany(() => EmployeeDocument, (document) => document.requirement, {
    cascade: false,
  })
  documents!: EmployeeDocument[];

  @ApiProperty({
    example: '2026-07-31T21:52:04.690Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-31T21:52:04.690Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
