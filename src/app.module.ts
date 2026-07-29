import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './common/database/data-source';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { EmployeesModule } from './modules/employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions;
      },
    }),
    DocumentTypesModule,
    EmployeesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
