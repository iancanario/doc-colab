import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('document_types')
export class DocumentType {
  @ApiProperty({
    example: 'a12f34',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'CPF',
  })
  @Column()
  name!: string;

  @ApiProperty({
    example: 'cpf',
  })
  @Column()
  code!: string;

  @OneToMany(
    () => EmployeeDocumentRequirement,
    (requirement) => requirement.documentType,
  )
  employeeRequirements!: EmployeeDocumentRequirement[];

  @ApiProperty({
    example: '2026-07-31T21:52:04.690Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-31T21:52:04.690Z',
  })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
