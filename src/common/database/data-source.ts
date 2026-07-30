import { config } from 'dotenv';
import { join } from 'path';
import { DocumentType } from '../../modules/document-types/entities/document-type.entity';
import { DataSourceOptions } from 'typeorm';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { EmployeeDocument } from '../../modules/employee-documents/entities/employee-document.entity';
import { EmployeeDocumentRequirement } from 'src/modules/employee-document-requirements/entities/employee-document-requirement.entity';

config();
const isProd = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    DocumentType,
    Employee,
    EmployeeDocumentRequirement,
    EmployeeDocument,
  ],
  migrations: [
    isProd
      ? join(process.cwd(), 'dist/database/migrations/*.js')
      : join(process.cwd(), 'src/database/migrations/*.ts'),
  ],

  synchronize: true,
};
