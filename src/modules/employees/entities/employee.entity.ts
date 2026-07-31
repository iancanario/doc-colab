import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDocumentRequirement } from '../../employee-document-requirements/entities/employee-document-requirement.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @ApiProperty({
    example: 'a12f34',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'João Silva',
  })
  @Column()
  name!: string;

  @ApiProperty({
    example: 'js@teste.com',
  })
  @Column({ unique: true })
  email!: string;

  @OneToMany(
    () => EmployeeDocumentRequirement,
    (requirement) => requirement.employee,
  )
  documentRequirements!: EmployeeDocumentRequirement[];

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
