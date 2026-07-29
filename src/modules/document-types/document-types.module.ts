import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType } from './entities/document-type.entity';
import { IDocumentTypesRepository } from './interfaces/document-types-repository.interface';
import { DocumentTypesRepository } from './document-types.repository';
import { IDocumentTypesService } from './interfaces/document-types-service.interface';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType])],
  providers: [
    {
      provide: IDocumentTypesRepository,
      useClass: DocumentTypesRepository,
    },
    {
      provide: IDocumentTypesService,
      useClass: DocumentTypesService,
    },
  ],
  controllers: [DocumentTypesController],
})
export class DocumentTypesModule {}
