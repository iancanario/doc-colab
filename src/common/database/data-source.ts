import { config } from 'dotenv';
import { join } from 'path';
import { DocumentType } from '../../modules/documentTypes/entities/documentType.entity';
import { DataSourceOptions } from 'typeorm';

config();
const isProd = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [DocumentType],
  migrations: [
    isProd
      ? join(process.cwd(), 'dist/database/migrations/*.js')
      : join(process.cwd(), 'src/database/migrations/*.ts'),
  ],

  synchronize: true,
};
