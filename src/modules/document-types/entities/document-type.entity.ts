import { EmployeeDocumentRequirement } from '../../../modules/employees/entities/employee-document-requirement.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/browser';

@Entity('document_types')
export class DocumentType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @OneToMany(
    () => EmployeeDocumentRequirement,
    (requirement) => requirement.documentType,
  )
  employeeRequirements!: EmployeeDocumentRequirement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
