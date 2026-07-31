import { EmployeeDocumentsService } from '../../employeeDocuments.service';
import { IEmployeeDocumentsRepository } from '../../interfaces/employee-document-repository.interface';
import { EmployeeDocument } from '../../entities/employee-document.entity';
import { CreateEmployeeDocumentDTO } from '../../dtos/create-employee-document.dto';

describe('EmployeeDocumentsService', () => {
  let service: EmployeeDocumentsService;
  let documentsRepository: jest.Mocked<IEmployeeDocumentsRepository>;

  beforeEach(() => {
    documentsRepository = {
      createEmployeeDocument: jest.fn(),
      findLastSents: jest.fn(),
      deleteEmployeeDocument: jest.fn(),
    } as jest.Mocked<IEmployeeDocumentsRepository>;

    service = new EmployeeDocumentsService(documentsRepository);
  });

  describe('create', () => {
    it('should create employee document successfully', async () => {
      const dto: CreateEmployeeDocumentDTO = {
        requirementId: 1,
        documentUrl: 'document.pdf',
      } as CreateEmployeeDocumentDTO;

      documentsRepository.createEmployeeDocument.mockResolvedValue(
        {} as EmployeeDocument,
      );

      const result = await service.create(dto);

      expect(documentsRepository.createEmployeeDocument).toHaveBeenCalledWith(
        dto,
      );

      expect(result).toEqual({
        message: 'Document linked successfully',
      });
    });

    it('should propagate repository error when creating employee document', async () => {
      const dto: CreateEmployeeDocumentDTO = {
        requirementId: 1,
        documentUrl: 'document.pdf',
      } as CreateEmployeeDocumentDTO;

      const error = new Error('Database error');

      documentsRepository.createEmployeeDocument.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toBe(error);

      expect(documentsRepository.createEmployeeDocument).toHaveBeenCalledWith(
        dto,
      );
    });
  });

  describe('findLastSents', () => {
    it('should return last sent documents successfully', async () => {
      const documents = [{ id: 1 }, { id: 2 }] as EmployeeDocument[];

      documentsRepository.findLastSents.mockResolvedValue(documents);

      const result = await service.findLastSents();

      expect(documentsRepository.findLastSents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(documents);
    });

    it('should propagate repository error when finding last sent documents', async () => {
      const error = new Error('Database error');

      documentsRepository.findLastSents.mockRejectedValue(error);

      await expect(service.findLastSents()).rejects.toBe(error);

      expect(documentsRepository.findLastSents).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete employee document successfully', async () => {
      documentsRepository.deleteEmployeeDocument.mockResolvedValue(undefined);

      const result = await service.delete(1);

      expect(documentsRepository.deleteEmployeeDocument).toHaveBeenCalledWith(
        1,
      );

      expect(result).toEqual({
        message: 'Document unlinked successfully',
      });
    });

    it('should propagate repository error when deleting employee document', async () => {
      const error = new Error('Database error');

      documentsRepository.deleteEmployeeDocument.mockRejectedValue(error);

      await expect(service.delete(1)).rejects.toBe(error);

      expect(documentsRepository.deleteEmployeeDocument).toHaveBeenCalledWith(
        1,
      );
    });
  });
});
