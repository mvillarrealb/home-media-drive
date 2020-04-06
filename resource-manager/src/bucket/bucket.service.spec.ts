import { Test, TestingModule } from '@nestjs/testing';
import { BucketService } from './bucket.service';
import { BucketRepository } from './bucket.repository';
import { InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { Bucket } from './bucket.entity';

describe('BucketService', () => {
  let service: BucketService;
  let repository;
  const bucket = {
    bucketName: 'MyPhotos',
    bucketDescription: 'My Photos album mock'
  };
  const filters = {
    limit: 10,
    offset: 0,
    search: 'photos'
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BucketService,
        { provide: BucketRepository, useValue: new BucketRepository() }
      ],
    }).compile();

    service = module.get<BucketService>(BucketService);
    repository = module.get<BucketRepository>(BucketRepository);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('listBuckets', () => {
    const mockQueryBuilder = {
      andWhere: jest.fn(),
      getMany: jest.fn(),
      limit: jest.fn(),
      offset: jest.fn(),
    }
    it('finds buckets', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder);
      expect(mockQueryBuilder.getMany).not.toHaveBeenCalled();
      const result = await service.listBuckets(filters);
      expect(result).toEqual([]);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });
  describe('createBucket', () => {
    it('creates bucket', async() => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(null);
      expect(service.createBucket(bucket)).resolves.toBeInstanceOf(Bucket);

    });
    it('throws conflict when bucket exists', async() => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce({ code: '23505'});
      expect(service.createBucket(bucket)).rejects.toThrow(ConflictException);
    });
    it('throws error when errors ocurrs', async() => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce({ code: '999'});
      expect(service.createBucket(bucket)).rejects.toThrow(InternalServerErrorException);
    });
  });
  describe('findBucket', () => {
    it('finds a single bucket', async() => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(new Bucket());
      expect(service.findBucket('bucket')).resolves.toBeInstanceOf(Bucket);
    });
    it('throws error when bucket does not exists', async() => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      expect(service.findBucket('bucket')).rejects.toThrow(NotFoundException);
    });
  });
});
