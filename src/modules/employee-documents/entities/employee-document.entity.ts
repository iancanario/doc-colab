import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';

@Entity()
export class EmployeeDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'document_url' })
  documentUrl!: string;

  @Column()
  version!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @ManyToOne(
    () => EmployeeDocumentRequirement,
    (requirement) => requirement.documents,
  )
  @JoinColumn({
    name: 'requirement_id',
  })
  requirement!: EmployeeDocumentRequirement;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
