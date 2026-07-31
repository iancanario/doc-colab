import { EmployeeDocumentRequirementsService } from '../../employee-document-requirements.service';
import { IEmployeeDocumentRequirementRepository } from '../../interfaces/employee-document-requirement-repository.interface';
import { EmployeeDocument } from '../../../employee-documents/entities/employee-document.entity';
import { EmployeeDocumentRequirement } from '../../entities/employee-document-requirement.entity';
import { FindPendingDocumentsDTO } from '../../dtos/find-pending-documents.dto';

describe('EmployeeDocumentRequirementsService', () => {
  let service: EmployeeDocumentRequirementsService;
  let requirementRepository: jest.Mocked<IEmployeeDocumentRequirementRepository>;

  beforeEach(() => {
    requirementRepository = {
      findPendingDocuments: jest.fn(),
      percentualSentDocuments: jest.fn(),
      mostDocumentsPendings: jest.fn(),
    } as jest.Mocked<IEmployeeDocumentRequirementRepository>;

    service = new EmployeeDocumentRequirementsService(requirementRepository);
  });

  describe('findDocumentsPending', () => {
    it('should return paginated pending documents successfully', async () => {
      const filters: FindPendingDocumentsDTO = {
        page: 1,
        limit: 10,
      } as FindPendingDocumentsDTO;

      const response = {
        data: [{ id: 'doc-1' }] as EmployeeDocument[],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      requirementRepository.findPendingDocuments.mockResolvedValue(response);

      const result = await service.findDocumentsPending(filters);

      expect(requirementRepository.findPendingDocuments).toHaveBeenCalledWith(
        filters,
      );
      expect(result).toEqual(response);
    });

    it('should propagate repository error when find pendings', async () => {
      const filters: FindPendingDocumentsDTO = {} as FindPendingDocumentsDTO;
      const error = new Error('Database error');

      requirementRepository.findPendingDocuments.mockRejectedValue(error);

      await expect(service.findDocumentsPending(filters)).rejects.toBe(error);
      expect(requirementRepository.findPendingDocuments).toHaveBeenCalledWith(
        filters,
      );
    });
  });

  describe('percentualSentDocuments', () => {
    it('should return the sent documents percentage successfully', async () => {
      requirementRepository.percentualSentDocuments.mockResolvedValue(40);

      const result = await service.percentualSentDocuments();

      expect(
        requirementRepository.percentualSentDocuments,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(40);
    });

    it('should propagate repository error when calculate percentual sents', async () => {
      const error = new Error('Database error');
      requirementRepository.percentualSentDocuments.mockRejectedValue(error);

      await expect(service.percentualSentDocuments()).rejects.toBe(error);
      expect(
        requirementRepository.percentualSentDocuments,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('mostDocumentsPendings', () => {
    it('should return the document types with the most pending documents', async () => {
      const requirements = [{ id: 1 }] as EmployeeDocumentRequirement[];

      requirementRepository.mostDocumentsPendings.mockResolvedValue(
        requirements,
      );

      const result = await service.mostDocumentsPendings();

      expect(requirementRepository.mostDocumentsPendings).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual(requirements);
    });

    it('should propagate repository error when finding most documents pendings', async () => {
      const error = new Error('Database error');
      requirementRepository.mostDocumentsPendings.mockRejectedValue(error);

      await expect(service.mostDocumentsPendings()).rejects.toBe(error);
      expect(requirementRepository.mostDocumentsPendings).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
