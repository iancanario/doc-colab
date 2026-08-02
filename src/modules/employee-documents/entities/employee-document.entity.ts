import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index('IDX_employee_documents_active_requirement', ['requirement'], {
  where: `"is_active" = true AND "deleted_at" IS NULL`,
})
@Entity()
export class EmployeeDocument {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a12f34',
  })
  id!: string;

  @Column({ name: 'document_url' })
  @ApiProperty({
    example: 'http://photo.com.br',
  })
  documentUrl!: string;

  @Column()
  @ApiProperty({
    example: 1,
  })
  version!: number;

  @Column({ name: 'is_active', default: true })
  @ApiProperty({
    example: true,
  })
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
