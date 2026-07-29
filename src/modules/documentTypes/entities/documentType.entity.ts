import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('document_types')
export class DocumentType {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @DeleteDateColumn({name: 'deleted_at', nullable: true})
  deletedAt?: Date
}