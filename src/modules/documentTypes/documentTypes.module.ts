import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentType } from './entities/documentType.entity';
import { IDocumentTypesRepository } from './interfaces/documentTypesRepository.interface';
import { DocumentTypesRepository } from './documentTypes.repository';
import { IDocumentTypesService } from './interfaces/documentTypesService.interface';
import { DocumentTypesService } from './documentTypes.service';
import { DocumentTypesController } from './documentTypes.controller';

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
